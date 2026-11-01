const APP_ORIGIN = 'https://app.schemacraft-ai.site';

/** External radar link. This must stay off the marketing sitemap. */
export function radarAppUrl(auditedUrl: string): string {
  const target = new URL(APP_ORIGIN);
  target.searchParams.set('url', auditedUrl);
  return target.toString();
}

export function drawResultCard(
  canvas: HTMLCanvasElement,
  input: { lang: 'en' | 'ar'; score: number; url: string },
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = 1200;
  canvas.height = 630;
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const arabic = input.lang === 'ar';
  ctx.direction = arabic ? 'rtl' : 'ltr';
  ctx.textAlign = arabic ? 'right' : 'left';
  const x = arabic ? 1120 : 80;
  ctx.fillStyle = '#22d3ee';
  ctx.font = '700 28px sans-serif';
  ctx.fillText('SchemaCraft', x, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 84px sans-serif';
  ctx.fillText(String(input.score), x, 230);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px sans-serif';
  ctx.fillText(arabic ? 'درجة جاهزية صفحة واحدة' : 'One-page readiness score', x, 280);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 26px sans-serif';
  const shown = input.url.length > 72 ? `${input.url.slice(0, 69)}...` : input.url;
  ctx.fillText(shown, x, 360);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 26px sans-serif';
  const note = arabic
    ? 'هذه درجة فحص الصفحة. ليست ترتيباً وليست ذكراً في إجابة ذكاء اصطناعي.'
    : 'This is a page audit score. It is not a ranking and not a mention in an AI answer.';
  const words = note.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (ctx.measureText(trial).width > 1000 && current) {
      lines.push(current);
      current = word;
    } else {
      current = trial;
    }
  }
  if (current) lines.push(current);
  lines.forEach((line, index) => ctx.fillText(line, x, 450 + index * 40));
}
