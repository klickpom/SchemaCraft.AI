<?php
/**
 * SchemaCraft.AI server-side audit fetch (evidence collector v2).
 * Static Hostinger export cannot run Next API routes, so this PHP endpoint
 * collects raw evidence; all scoring happens in lib/audit (TypeScript).
 *
 * SSRF: http(s) only, ports 80/443/8080/8443, no credentials, DNS resolved once,
 * private/reserved IPs blocked, and the validated IP is pinned with CURLOPT_RESOLVE
 * on every hop (no DNS-rebinding window). Timeouts and byte caps on every request.
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', ['POST', 'GET'], true)) {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

@set_time_limit(60);
if (function_exists('ob_gzhandler') && !ini_get('zlib.output_compression')) {
  ob_start('ob_gzhandler');
}

const SC_VERSION = '2.0';
const SC_UA = 'Mozilla/5.0 (compatible; SchemaCraftBot/2.0; +https://schemacraft-ai.site/about/)';
const SC_BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const SC_HTML_CAP = 2097152;
const SC_ROBOTS_CAP = 524288;
const SC_SITEMAP_CAP = 1048576;
const SC_SMALL_CAP = 262144;
const SC_PROBE_CAP = 65536;

/** Published user-agent strings from each vendor's crawler documentation. */
const SC_BOT_PROBES = [
  'googlebot' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'bingbot' => 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'oai-searchbot' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)',
  'gptbot' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.1; +https://openai.com/gptbot)',
  'chatgpt-user' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
  'claudebot' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
  'perplexitybot' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
];

function sc_fail(int $code, string $error, string $detail = ''): void {
  http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $error, 'detail' => $detail, 'version' => SC_VERSION]);
  exit;
}

function sc_client_ip(): string {
  $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
  return preg_match('/^[0-9a-fA-F:.]+$/', $ip) ? $ip : '0.0.0.0';
}

function sc_rate_limit(string $ip): void {
  $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'schemacraft-audit';
  if (!is_dir($dir)) @mkdir($dir, 0700, true);
  $file = $dir . DIRECTORY_SEPARATOR . hash('sha256', $ip) . '.json';
  $now = time();
  $window = 600;
  $max = 20;
  $fp = @fopen($file, 'c+');
  if (!$fp) return;
  flock($fp, LOCK_EX);
  $raw = stream_get_contents($fp);
  $hits = [];
  if ($raw) {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) $hits = $decoded;
  }
  $hits = array_values(array_filter($hits, fn($t) => is_int($t) && ($now - $t) < $window));
  if (count($hits) >= $max) {
    flock($fp, LOCK_UN);
    fclose($fp);
    sc_fail(429, 'rate_limited');
  }
  $hits[] = $now;
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, json_encode($hits));
  flock($fp, LOCK_UN);
  fclose($fp);
}

function sc_ipv4_blocked(string $ip): bool {
  $long = ip2long($ip);
  if ($long === false) return true;
  $ranges = [
    ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
    ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
    ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
    ['224.0.0.0', 4], ['240.0.0.0', 4],
  ];
  foreach ($ranges as [$base, $bits]) {
    $mask = -1 << (32 - $bits);
    if (($long & $mask) === (ip2long($base) & $mask)) return true;
  }
  return false;
}

function sc_ipv6_blocked(string $ip): bool {
  $lower = strtolower($ip);
  if ($lower === '::1' || $lower === '::') return true;
  if (str_starts_with($lower, '::ffff:')) return sc_ipv4_blocked(substr($lower, 7));
  foreach (['fe8', 'fe9', 'fea', 'feb', 'fc', 'fd', 'ff', '2001:db8'] as $prefix) {
    if (str_starts_with($lower, $prefix)) return true;
  }
  return false;
}

/**
 * Validate a URL and resolve its host once.
 * @return array{url:string,host:string,port:int,ip:string,scheme:string}|null
 */
function sc_target(string $raw): ?array {
  $trimmed = trim($raw);
  if ($trimmed === '' || strlen($trimmed) > 2048) return null;
  $parts = parse_url($trimmed);
  if (!$parts || empty($parts['scheme']) || empty($parts['host'])) return null;
  $scheme = strtolower($parts['scheme']);
  if ($scheme !== 'http' && $scheme !== 'https') return null;
  if (!empty($parts['user']) || !empty($parts['pass'])) return null;
  $port = isset($parts['port']) ? (int) $parts['port'] : ($scheme === 'https' ? 443 : 80);
  if (!in_array($port, [80, 443, 8080, 8443], true)) return null;
  $host = rtrim(strtolower($parts['host']), '.');
  $host = trim($host, '[]');
  if ($host === '' || $host === 'localhost' || str_ends_with($host, '.localhost') || str_ends_with($host, '.local') || str_ends_with($host, '.internal')) return null;

  $ip = null;
  if (filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
    if (sc_ipv4_blocked($host)) return null;
    $ip = $host;
  } elseif (filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
    if (sc_ipv6_blocked($host)) return null;
    $ip = $host;
  } else {
    $ips = @gethostbynamel($host);
    if ($ips) {
      foreach ($ips as $candidate) {
        if (sc_ipv4_blocked($candidate)) return null;
      }
      $ip = $ips[0];
    } else {
      $records = @dns_get_record($host, DNS_AAAA);
      if (is_array($records)) {
        foreach ($records as $record) {
          if (!empty($record['ipv6'])) {
            if (sc_ipv6_blocked($record['ipv6'])) return null;
            $ip = $ip ?? $record['ipv6'];
          }
        }
      }
    }
  }
  if (!$ip) return null;
  return ['url' => $trimmed, 'host' => $host, 'port' => $port, 'ip' => $ip, 'scheme' => $scheme];
}

/** Build a curl handle with a byte cap that keeps the partial body instead of failing. */
function sc_handle(array $target, string $ua, int $cap, int $timeout, bool $certInfo = false): array {
  $job = new stdClass();
  $job->body = '';
  $job->truncated = false;
  $job->headers = [];
  $job->cap = $cap;

  $ch = curl_init($target['url']);
  $ipForResolve = str_contains($target['ip'], ':') ? '[' . $target['ip'] . ']' : $target['ip'];
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 6,
    CURLOPT_TIMEOUT => $timeout,
    CURLOPT_USERAGENT => $ua,
    CURLOPT_HTTPHEADER => [
      'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7',
      'Accept-Language: en-US,en;q=0.9,ar;q=0.8',
    ],
    CURLOPT_ENCODING => '',
    CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
    CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_RESOLVE => [$target['host'] . ':' . $target['port'] . ':' . $ipForResolve],
    CURLOPT_CERTINFO => $certInfo,
    CURLOPT_HEADERFUNCTION => function ($ch, $line) use ($job) {
      $trimmed = trim($line);
      if (preg_match('#^HTTP/\S+\s+\d{3}#i', $trimmed)) {
        $job->headers = [];
      } elseif ($trimmed !== '' && strpos($trimmed, ':') !== false) {
        [$k, $v] = explode(':', $trimmed, 2);
        $key = strtolower(trim($k));
        $val = trim($v);
        $job->headers[$key] = isset($job->headers[$key]) ? $job->headers[$key] . ', ' . $val : $val;
      }
      return strlen($line);
    },
    CURLOPT_WRITEFUNCTION => function ($ch, $chunk) use ($job) {
      $remaining = $job->cap - strlen($job->body);
      if ($remaining <= 0) {
        $job->truncated = true;
        return -1;
      }
      if (strlen($chunk) > $remaining) {
        $job->body .= substr($chunk, 0, $remaining);
        $job->truncated = true;
        return -1;
      }
      $job->body .= $chunk;
      return strlen($chunk);
    },
  ]);
  return [$ch, $job];
}

function sc_error_kind(int $errno): string {
  switch ($errno) {
    case 6: return 'dns';
    case 7: return 'connect';
    case 28: return 'timeout';
    case 35: case 51: case 53: case 54: case 58: case 59: case 60: case 64: case 66: case 77: case 80: case 82: case 83: case 90: case 91:
      return 'ssl';
    case 47: return 'too_many_redirects';
    case 52: return 'empty_reply';
    case 56: return 'connection_reset';
    default: return 'fetch_failed';
  }
}

function sc_collect($ch, stdClass $job, int $errno, string $url): array {
  $ok = $errno === 0 || ($errno === 23 && $job->truncated);
  $info = curl_getinfo($ch);
  $result = [
    'ok' => $ok,
    'url' => $url,
    'status' => $ok ? (int) ($info['http_code'] ?? 0) : null,
    'headers' => $job->headers,
    'body' => $job->body,
    'truncated' => $job->truncated,
    'bytes' => strlen($job->body),
    'ttfbMs' => (int) round(((float) ($info['starttransfer_time'] ?? 0)) * 1000),
    'totalMs' => (int) round(((float) ($info['total_time'] ?? 0)) * 1000),
    'connectMs' => (int) round(((float) ($info['connect_time'] ?? 0)) * 1000),
    'tlsMs' => (int) round(((float) ($info['appconnect_time'] ?? 0)) * 1000),
    'httpVersion' => sc_http_version((int) ($info['http_version'] ?? 0)),
    'error' => $ok ? null : sc_error_kind($errno),
    'certExpiry' => null,
  ];
  if (!empty($info['certinfo']) && is_array($info['certinfo'])) {
    $first = $info['certinfo'][0] ?? [];
    $expire = $first['Expire date'] ?? $first['Expire Date'] ?? null;
    if ($expire) {
      $ts = strtotime($expire);
      if ($ts) $result['certExpiry'] = gmdate('c', $ts);
    }
  }
  return $result;
}

function sc_http_version(int $v): ?string {
  if ($v === 0) return null;
  if ($v === 1) return '1.0';
  if ($v === 2) return '1.1';
  if ($v === 3) return '2';
  if ($v === 30) return '3';
  return (string) $v;
}

/** Single request (no redirects). */
function sc_request(string $url, string $ua, int $cap, int $timeout, bool $certInfo = false): array {
  $target = sc_target($url);
  if (!$target) return ['ok' => false, 'url' => $url, 'status' => null, 'error' => 'blocked_url', 'headers' => [], 'body' => '', 'bytes' => 0, 'truncated' => false];
  [$ch, $job] = sc_handle($target, $ua, $cap, $timeout, $certInfo);
  curl_exec($ch);
  $errno = curl_errno($ch);
  $res = sc_collect($ch, $job, $errno, $target['url']);
  curl_close($ch);
  return $res;
}

/** Run several single requests in parallel. @param array<string,array{url:string,ua:string,cap:int,timeout:int}> $specs */
function sc_parallel(array $specs): array {
  $mh = curl_multi_init();
  $jobs = [];
  $results = [];
  foreach ($specs as $key => $spec) {
    $target = sc_target($spec['url']);
    if (!$target) {
      $results[$key] = ['ok' => false, 'url' => $spec['url'], 'status' => null, 'error' => 'blocked_url', 'headers' => [], 'body' => '', 'bytes' => 0, 'truncated' => false];
      continue;
    }
    [$ch, $job] = sc_handle($target, $spec['ua'], $spec['cap'], $spec['timeout']);
    curl_multi_add_handle($mh, $ch);
    $jobs[$key] = [$ch, $job, $target['url']];
  }
  $running = 0;
  do {
    $status = curl_multi_exec($mh, $running);
    if ($running) curl_multi_select($mh, 0.5);
  } while ($running && $status === CURLM_OK);

  $errnos = [];
  while ($msg = curl_multi_info_read($mh)) {
    $errnos[spl_object_id($msg['handle'])] = (int) $msg['result'];
  }
  foreach ($jobs as $key => [$ch, $job, $url]) {
    $errno = $errnos[spl_object_id($ch)] ?? curl_errno($ch);
    $results[$key] = sc_collect($ch, $job, $errno, $url);
    curl_multi_remove_handle($mh, $ch);
    curl_close($ch);
  }
  curl_multi_close($mh);
  return $results;
}

function sc_absolute(string $base, string $location): string {
  if (preg_match('#^https?://#i', $location)) return $location;
  $b = parse_url($base);
  $origin = ($b['scheme'] ?? 'https') . '://' . ($b['host'] ?? '') . (isset($b['port']) ? ':' . $b['port'] : '');
  if (str_starts_with($location, '//')) return ($b['scheme'] ?? 'https') . ':' . $location;
  if (str_starts_with($location, '/')) return $origin . $location;
  $path = $b['path'] ?? '/';
  $dir = substr($path, 0, (int) strrpos($path, '/') + 1);
  return $origin . $dir . $location;
}

/** Follow redirects manually so every hop is SSRF-checked and recorded. */
function sc_follow(string $url, string $ua, int $cap, int $timeout, int $maxHops, bool $certInfo = false): array {
  $chain = [];
  $current = $url;
  $res = null;
  for ($i = 0; $i <= $maxHops; $i++) {
    $res = sc_request($current, $ua, $cap, $timeout, $certInfo && $i === 0);
    $chain[] = ['url' => $current, 'status' => $res['status']];
    if (!$res['ok']) break;
    $status = (int) $res['status'];
    $location = $res['headers']['location'] ?? '';
    if ($status >= 300 && $status < 400 && $location !== '') {
      if ($i === $maxHops) {
        $res['ok'] = false;
        $res['error'] = 'too_many_redirects';
        break;
      }
      $current = sc_absolute($current, $location);
      continue;
    }
    break;
  }
  return [$res, $chain];
}

function sc_challenge(array $res): ?string {
  $h = $res['headers'] ?? [];
  $body = substr($res['body'] ?? '', 0, 65536);
  $status = (int) ($res['status'] ?? 0);
  if (!empty($h['cf-mitigated'])) return 'cloudflare';
  if (stripos($body, 'challenge-platform') !== false || stripos($body, '<title>Just a moment') !== false || stripos($body, 'Attention Required! | Cloudflare') !== false) return 'cloudflare';
  if (stripos($body, '_Incapsula_Resource') !== false) return 'imperva';
  if (stripos($body, 'px-captcha') !== false || stripos($body, 'perimeterx') !== false) return 'perimeterx';
  if (stripos($body, 'datadome') !== false && $status >= 400) return 'datadome';
  if ($status === 403 && stripos($body, 'Reference #') !== false && stripos($body, 'Access Denied') !== false) return 'akamai';
  if (stripos($body, 'bm-verify=') !== false || stripos($body, '/_sec/verify?provider=interstitial') !== false) return 'akamai';
  if (stripos($body, 'opfcaptcha') !== false || stripos($body, 'api/challenge/captcha') !== false) return 'generic';
  if (stripos($body, 'sgcaptcha') !== false || stripos($body, '/.well-known/sgcaptcha') !== false) return 'siteground';
  if ($status >= 400 && preg_match('/captcha|are you a robot|verify you are human|bot protection/i', $body)) return 'generic';
  return null;
}

function sc_title(string $html): ?string {
  if (preg_match('#<title[^>]*>(.*?)</title>#is', $html, $m)) {
    $t = trim(html_entity_decode(strip_tags($m[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    if ($t === '') return null;
    return function_exists('mb_substr') ? mb_substr($t, 0, 200) : substr($t, 0, 200);
  }
  return null;
}

function sc_jsonld(string $html): array {
  $out = [];
  if (!preg_match_all('/<script[^>]*type=["\']?application\/ld\+json["\']?[^>]*>(.*?)<\/script>/is', $html, $m)) {
    return $out;
  }
  foreach ($m[1] as $block) {
    $trimmed = trim($block);
    $decoded = json_decode($trimmed, true);
    if (!is_array($decoded)) $decoded = json_decode(html_entity_decode($trimmed, ENT_QUOTES | ENT_HTML5, 'UTF-8'), true);
    if (is_array($decoded)) $out[] = $decoded;
  }
  return $out;
}

function sc_utf8(string $s): string {
  if ($s === '' || !function_exists('mb_check_encoding') || mb_check_encoding($s, 'UTF-8')) return $s;
  if (function_exists('mb_convert_encoding')) {
    $converted = @mb_convert_encoding($s, 'UTF-8', 'UTF-8, ISO-8859-1, Windows-1256, Windows-1252');
    if (is_string($converted)) return $converted;
  }
  return iconv('UTF-8', 'UTF-8//IGNORE', $s) ?: '';
}

sc_rate_limit(sc_client_ip());

$payload = [];
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  $payload = json_decode(file_get_contents('php://input') ?: '', true) ?: [];
}
$url = (string) ($payload['url'] ?? $_GET['url'] ?? '');
if (!sc_target($url)) sc_fail(400, 'blocked_url');

$started = microtime(true);

[$page, $chain] = sc_follow($url, SC_UA, SC_HTML_CAP, 15, 6, true);
$uaMode = 'standard';
$firstStatus = $page['status'] ?? null;
$needsFallback = !$page['ok'] && in_array($page['error'], ['empty_reply', 'connection_reset'], true);
$needsFallback = $needsFallback || ($page['ok'] && (in_array((int) $page['status'], [401, 403, 406, 429, 503], true) || sc_challenge($page)));
if ($needsFallback) {
  [$retry, $retryChain] = sc_follow($url, SC_BROWSER_UA, SC_HTML_CAP, 15, 6, true);
  if ($retry['ok'] && (int) $retry['status'] < 400 && !sc_challenge($retry)) {
    $page = $retry;
    $chain = $retryChain;
    $uaMode = 'browser-fallback';
  }
}

if (!$page['ok']) {
  http_response_code(200);
  echo json_encode([
    'ok' => false,
    'error' => $page['error'] ?? 'fetch_failed',
    'requestedUrl' => $url,
    'redirects' => $chain,
    'version' => SC_VERSION,
    'timingMs' => (int) round((microtime(true) - $started) * 1000),
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
  exit;
}

$finalUrl = $page['url'];
$fp = parse_url($finalUrl);
$origin = $fp['scheme'] . '://' . $fp['host'] . (isset($fp['port']) ? ':' . $fp['port'] : '');
$html = sc_utf8($page['body']);

$specs = [
  'robots' => ['url' => $origin . '/robots.txt', 'ua' => SC_UA, 'cap' => SC_ROBOTS_CAP, 'timeout' => 8],
  'llms' => ['url' => $origin . '/llms.txt', 'ua' => SC_UA, 'cap' => SC_SMALL_CAP, 'timeout' => 8],
  'sitemapDefault' => ['url' => $origin . '/sitemap.xml', 'ua' => SC_UA, 'cap' => SC_SITEMAP_CAP, 'timeout' => 10],
  'notFound' => ['url' => $origin . '/schemacraft-404-check-' . bin2hex(random_bytes(4)) . '/', 'ua' => SC_UA, 'cap' => SC_PROBE_CAP, 'timeout' => 8],
];
if ($fp['scheme'] === 'https') {
  $specs['httpVariant'] = ['url' => 'http://' . $fp['host'] . ($fp['path'] ?? '/'), 'ua' => SC_UA, 'cap' => SC_PROBE_CAP, 'timeout' => 6];
}
foreach (SC_BOT_PROBES as $id => $ua) {
  $specs['bot:' . $id] = ['url' => $finalUrl, 'ua' => $ua, 'cap' => SC_PROBE_CAP, 'timeout' => 9];
}
$batch = sc_parallel($specs);

$robots = $batch['robots'];
$robotsChain = [['url' => $robots['url'], 'status' => $robots['status']]];
if ($robots['ok'] && (int) $robots['status'] >= 300 && (int) $robots['status'] < 400 && !empty($robots['headers']['location'])) {
  [$robots, $robotsChain] = sc_follow(sc_absolute($robots['url'], $robots['headers']['location']), SC_UA, SC_ROBOTS_CAP, 8, 4);
  array_unshift($robotsChain, ['url' => $origin . '/robots.txt', 'status' => $batch['robots']['status']]);
}
$robotsOk = $robots['ok'] && (int) $robots['status'] === 200;
$robotsBody = $robotsOk ? sc_utf8($robots['body']) : '';

$sitemapUrls = [];
if ($robotsBody !== '' && preg_match_all('/^\s*sitemap:\s*(\S+)/mi', $robotsBody, $sm)) {
  foreach ($sm[1] as $s) $sitemapUrls[] = trim($s);
}
$sitemapUrl = $sitemapUrls[0] ?? ($origin . '/sitemap.xml');
$sitemap = ($sitemapUrl === $origin . '/sitemap.xml') ? $batch['sitemapDefault'] : null;
if ($sitemap === null || ($sitemap['ok'] && (int) $sitemap['status'] >= 300 && (int) $sitemap['status'] < 400)) {
  [$sitemap] = sc_follow($sitemapUrl, SC_UA, SC_SITEMAP_CAP, 10, 3);
}
$sitemapOk = $sitemap['ok'] && (int) $sitemap['status'] === 200;

$llms = $batch['llms'];
if ($llms['ok'] && (int) $llms['status'] >= 300 && (int) $llms['status'] < 400) {
  [$llms] = sc_follow($origin . '/llms.txt', SC_UA, SC_SMALL_CAP, 8, 3);
}
$llmsOk = $llms['ok'] && (int) $llms['status'] === 200;

$retrySpecs = [];
foreach (SC_BOT_PROBES as $id => $ua) {
  $r = $batch['bot:' . $id];
  if (!$r['ok'] || in_array((int) $r['status'], [429, 502, 503, 504], true)) {
    $retrySpecs['bot:' . $id] = ['url' => $finalUrl, 'ua' => $ua, 'cap' => SC_PROBE_CAP, 'timeout' => 9];
  }
}
$retried = [];
if ($retrySpecs) {
  usleep(1500000);
  foreach (sc_parallel($retrySpecs) as $key => $r) {
    $retried[$key] = $batch[$key]['status'];
    $batch[$key] = $r;
  }
}

$bots = [];
foreach (SC_BOT_PROBES as $id => $ua) {
  $r = $batch['bot:' . $id];
  $bots[] = [
    'id' => $id,
    'firstStatus' => $retried['bot:' . $id] ?? null,
    'retried' => array_key_exists('bot:' . $id, $retried),
    'status' => $r['status'],
    'error' => $r['error'],
    'bytes' => $r['bytes'],
    'ms' => $r['totalMs'] ?? null,
    'challenge' => $r['ok'] ? sc_challenge($r) : null,
    'title' => $r['ok'] ? sc_title($r['body']) : null,
    'location' => $r['headers']['location'] ?? null,
  ];
}

$httpVariant = null;
if (isset($batch['httpVariant'])) {
  $hv = $batch['httpVariant'];
  $httpVariant = [
    'url' => $hv['url'],
    'status' => $hv['status'],
    'error' => $hv['error'],
    'location' => $hv['headers']['location'] ?? null,
  ];
}

$nf = $batch['notFound'];
if ($nf['ok'] && (int) $nf['status'] >= 300 && (int) $nf['status'] < 400 && !empty($nf['headers']['location'])) {
  $redirectedFrom = (int) $nf['status'];
  [$nf] = sc_follow(sc_absolute($nf['url'], $nf['headers']['location']), SC_UA, SC_PROBE_CAP, 8, 3);
  $nf['redirectedFrom'] = $redirectedFrom;
}
$notFound = [
  'redirectedFrom' => $nf['redirectedFrom'] ?? null,
  'url' => $nf['url'],
  'status' => $nf['status'],
  'error' => $nf['error'],
  'location' => $nf['headers']['location'] ?? null,
  'title' => $nf['ok'] ? sc_title($nf['body']) : null,
];

echo json_encode([
  'ok' => true,
  'version' => SC_VERSION,
  'requestedUrl' => $url,
  'finalUrl' => $finalUrl,
  'status' => $page['status'],
  'redirects' => $chain,
  'headers' => $page['headers'],
  'html' => $html,
  'htmlTruncated' => $page['truncated'],
  'htmlBytes' => $page['bytes'],
  'jsonLd' => sc_jsonld($html),
  'fetch' => [
    'uaMode' => $uaMode,
    'firstStatus' => $firstStatus,
    'challenge' => sc_challenge($page),
    'ttfbMs' => $page['ttfbMs'],
    'totalMs' => $page['totalMs'],
    'connectMs' => $page['connectMs'],
    'tlsMs' => $page['tlsMs'],
    'httpVersion' => $page['httpVersion'],
    'certExpiry' => $page['certExpiry'],
  ],
  'robotsTxt' => $robotsBody,
  'robotsStatus' => $robots['status'] ?? null,
  'robotsError' => $robots['error'] ?? null,
  'robotsRedirects' => $robotsChain,
  'sitemapXml' => $sitemapOk ? sc_utf8($sitemap['body']) : '',
  'sitemapUrl' => $sitemapUrl,
  'sitemapUrls' => $sitemapUrls,
  'sitemapStatus' => $sitemap['status'] ?? null,
  'sitemapTruncated' => $sitemap['truncated'] ?? false,
  'llmsTxt' => $llmsOk ? sc_utf8($llms['body']) : '',
  'llmsStatus' => $llms['status'] ?? null,
  'llmsContentType' => $llms['headers']['content-type'] ?? null,
  'probes' => [
    'bots' => $bots,
    'httpVariant' => $httpVariant,
    'notFound' => $notFound,
  ],
  'timingMs' => (int) round((microtime(true) - $started) * 1000),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
