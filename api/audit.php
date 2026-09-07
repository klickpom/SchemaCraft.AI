<?php
/**
 * SchemaCraft.AI server-side audit fetch.
 * Merchant-of-record / static Hostinger cannot run Next API routes (output: export).
 * This PHP endpoint is the same-origin fetch so the browser is not blocked by CORS.
 *
 * SSRF: http(s) only, no credentials, DNS resolved and private/reserved IPs blocked
 * on every redirect hop. Timeouts and size caps enforced. Errors are generic.
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

function sc_fail(int $code, string $error): void {
  http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $error]);
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
  $fp = fopen($file, 'c+');
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
    ['0.0.0.0', 8],
    ['10.0.0.0', 8],
    ['127.0.0.0', 8],
    ['169.254.0.0', 16],
    ['172.16.0.0', 12],
    ['192.168.0.0', 16],
    ['100.64.0.0', 10],
  ];
  foreach ($ranges as [$base, $bits]) {
    $baseLong = ip2long($base);
    $mask = $bits === 0 ? 0 : (-1 << (32 - $bits));
    if (($long & $mask) === ($baseLong & $mask)) return true;
  }
  return false;
}

function sc_ipv6_blocked(string $ip): bool {
  $lower = strtolower($ip);
  if ($lower === '::1' || $lower === '::') return true;
  if (str_starts_with($lower, 'fe80:') || str_starts_with($lower, 'fc') || str_starts_with($lower, 'fd')) return true;
  return false;
}

function sc_host_blocked(string $host): bool {
  $host = rtrim(strtolower($host), '.');
  if ($host === '' || $host === 'localhost' || str_ends_with($host, '.localhost')) return true;
  if ($host === 'metadata.google.internal') return true;
  if (filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) return sc_ipv4_blocked($host);
  if (filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) return sc_ipv6_blocked($host);
  $ips = @gethostbynamel($host);
  if (!$ips) return true;
  foreach ($ips as $ip) {
    if (sc_ipv4_blocked($ip)) return true;
  }
  return false;
}

function sc_public_url(string $raw): ?string {
  $trimmed = trim($raw);
  $parts = parse_url($trimmed);
  if (!$parts || empty($parts['scheme']) || empty($parts['host'])) return null;
  $scheme = strtolower($parts['scheme']);
  if ($scheme !== 'http' && $scheme !== 'https') return null;
  if (!empty($parts['user']) || !empty($parts['pass'])) return null;
  if (sc_host_blocked($parts['host'])) return null;
  return $trimmed;
}

/**
 * @return array{status:int,url:string,headers:array<string,string>,body:string}|null
 */
function sc_curl(string $url, int $timeout = 10): ?array {
  if (!function_exists('curl_init')) return null;
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT => $timeout,
    CURLOPT_MAXFILESIZE => 524288,
    CURLOPT_USERAGENT => 'SchemaCraftBot/1.0 (+https://schemacraft-ai.site/)',
    CURLOPT_HTTPHEADER => ['Accept: text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8'],
    CURLOPT_HEADER => true,
    CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
    CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
  ]);
  $raw = curl_exec($ch);
  if ($raw === false) {
    curl_close($ch);
    return null;
  }
  $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
  curl_close($ch);
  $headerBlob = substr($raw, 0, $headerSize);
  $body = substr($raw, $headerSize);
  if (strlen($body) > 524288) $body = substr($body, 0, 524288);
  $headers = [];
  foreach (preg_split("/\r\n|\n|\r/", $headerBlob) as $line) {
    if (strpos($line, ':') === false) continue;
    [$k, $v] = explode(':', $line, 2);
    $headers[strtolower(trim($k))] = trim($v);
  }
  return ['status' => $status, 'url' => $url, 'headers' => $headers, 'body' => $body];
}

function sc_follow(string $url): array {
  $chain = [];
  $current = $url;
  $final = null;
  for ($i = 0; $i < 5; $i++) {
    $safe = sc_public_url($current);
    if (!$safe) sc_fail(400, 'blocked_url');
    $res = sc_curl($safe);
    if (!$res) sc_fail(502, 'fetch_failed');
    $chain[] = ['url' => $safe, 'status' => $res['status']];
    $final = $res;
    if ($res['status'] >= 300 && $res['status'] < 400 && !empty($res['headers']['location'])) {
      $next = $res['headers']['location'];
      if (!preg_match('#^https?://#i', $next)) {
        $base = parse_url($safe);
        $next = ($base['scheme'] ?? 'https') . '://' . ($base['host'] ?? '') . (str_starts_with($next, '/') ? $next : '/' . $next);
      }
      $current = $next;
      continue;
    }
    break;
  }
  return [$final, $chain];
}

sc_rate_limit(sc_client_ip());

$payload = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $payload = json_decode(file_get_contents('php://input') ?: '', true) ?: [];
}
$url = (string) ($payload['url'] ?? $_GET['url'] ?? '');
$safe = sc_public_url($url);
if (!$safe) sc_fail(400, 'blocked_url');

$started = microtime(true);
[$page, $chain] = sc_follow($safe);
$origin = parse_url($page['url'], PHP_URL_SCHEME) . '://' . parse_url($page['url'], PHP_URL_HOST);

$robots = sc_curl(rtrim($origin, '/') . '/robots.txt', 8);
$sitemapUrl = rtrim($origin, '/') . '/sitemap.xml';
if ($robots && $robots['status'] === 200 && preg_match('/^sitemap:\s*(\S+)/mi', $robots['body'], $m)) {
  $sitemapUrl = trim($m[1]);
}
$sitemap = sc_public_url($sitemapUrl) ? sc_curl($sitemapUrl, 8) : null;
$llms = sc_curl(rtrim($origin, '/') . '/llms.txt', 8);

echo json_encode([
  'ok' => true,
  'requestedUrl' => $safe,
  'finalUrl' => $page['url'],
  'status' => $page['status'],
  'redirects' => $chain,
  'headers' => $page['headers'],
  'html' => $page['body'],
  'robotsTxt' => ($robots && $robots['status'] === 200) ? $robots['body'] : '',
  'robotsStatus' => $robots['status'] ?? null,
  'sitemapXml' => ($sitemap && $sitemap['status'] === 200) ? $sitemap['body'] : '',
  'sitemapUrl' => $sitemapUrl,
  'sitemapStatus' => $sitemap['status'] ?? null,
  'llmsTxt' => ($llms && $llms['status'] === 200) ? $llms['body'] : '',
  'llmsStatus' => $llms['status'] ?? null,
  'llmsContentType' => $llms['headers']['content-type'] ?? null,
  'timingMs' => (int) round((microtime(true) - $started) * 1000),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
