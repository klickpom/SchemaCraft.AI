# SchemaCraft.AI roadmap

Turn the free static audit into an SEO, GEO, and AIO platform that measures whether a brand is mentioned in AI answers and can apply server-rendered fixes. English and Arabic ship together. Public URLs on `https://schemacraft-ai.site` stay as they are.

Working rules:

- One phase at a time. Stop after each phase until the reply is `continue`.
- Diff the sitemap URL set before and after every phase. The frozen list is `apps/web/lib/seo/public-urls.txt` (56 URLs).
- `npm test` and `npm run build` pass before a phase is finished.
- Anything not verified is "not assessed". No promised rankings or guaranteed AI visibility.
- Fixes are server-rendered HTML. AI crawlers do not run JavaScript.

## Phase 0 — Foundation

- [x] npm workspaces, with no public URL changes
- [x] `apps/web`: current static site and free audit (`output: 'export'`, `trailingSlash: true`)
- [x] `packages/audit-core`: `lib/audit`, `lib/bots`, `lib/tools`, and their tests
- [x] Stop tracking repo-root build output (`_next`, generated HTML/TXT, `deploy_sync.js`, `zip_build.js`) and gitignore it
- [x] GitHub Action: install, test, build `apps/web`, publish `out/` plus `public/api/audit.php` and `.htaccess` to the `deploy` branch
- [x] `.cursor/rules/schemacraft.mdc` with the non-negotiable rules, `alwaysApply: true`
- [x] Acceptance: tests pass, sitemap URL set unchanged, `git status` clean after a build

## Phase 1 — Accounts + AI visibility radar

- [ ] `apps/app`: Next.js 15 (no static export) for `app.schemacraft-ai.site`, deployable to Vercel, reusing `apps/web` design tokens, English and Arabic with an RTL toggle
- [ ] Supabase (Postgres + Auth: email magic link and Google)
- [ ] Tables: `users`, `sites`, `prompts`, `runs`, `mentions`, `fixes`, `subscriptions`, `usage_costs`
- [ ] Row-level security on every table, with tests that user A cannot read user B
- [ ] Background jobs (Trigger.dev or Inngest; choice logged in `docs/DECISIONS.md`)
- [ ] Prompt generator: homepage text + niche + city + language → 30 buyer questions in English, Egyptian Arabic, Gulf Arabic, and MSA; user can edit, add, and delete
- [ ] Radar runner: each prompt × each enabled engine (OpenAI web search and Perplexity Sonar first), 3 runs each, raw answers stored
- [ ] Mention parser: brand or domain mentioned, position, competitor brands, cited URLs, sentiment; fixture tests in Arabic and English
- [ ] Report: share of voice per engine as a percentage with the min–max range across the 3 runs, top competitors, top cited domains
- [ ] Cost control: token cost per run in `usage_costs`, monthly budget cap per plan, hard stop when exceeded
- [ ] Free funnel on the existing audit result: "Check what ChatGPT says about you" → 3 free radar prompts after signup, plus a shareable result card (English and Arabic)
- [ ] Acceptance: full flow works in dry-run mode, parser tests pass, a report renders with ranges

## Phase 2 — Site-wide crawl + "what the bot sees" + paid plans

- [ ] `packages/crawler`: Node + Playwright worker, Dockerfile, up to 500 internal URLs from the sitemap and links, respects `robots.txt`, copies the `audit.php` SSRF rules, with tests
- [ ] Per page: raw HTML (no JS) and rendered HTML; text, headings, links, and JSON-LD that exist only after JavaScript
- [ ] `audit-core` checks per page; rank issues by pages affected × severity
- [ ] App view "What AI bots see": raw HTML as OAI-SearchBot sees it beside the rendered page, missing parts highlighted
- [ ] Plans, enforced server-side: Free ($0), Starter ($19/mo), Pro ($49/mo), Agency ($149/mo), with the limits in the phase brief
- [ ] Add Gemini (Google Search grounding) and Claude (web search) engines
- [ ] `PaymentProvider` interface: Paddle or Lemon Squeezy adapter, plus a manual/local adapter for Egypt and the Gulf
- [ ] Acceptance: a fixture site whose content is injected by JavaScript is flagged as invisible to AI crawlers; plan limits are tested

## Phase 3 — Auto-fix + content studio

- [ ] `packages/wp-plugin` "SchemaCraft Connect": API key, approved fixes printed in `wp_head` (JSON-LD, meta, robots.txt rules), AI crawler visit counts from the audit-core bot registry, daily counts, one-click rollback per fix
- [ ] PHPUnit tests; WordPress Plugin Check passes
- [ ] `packages/edge-worker`: Cloudflare Worker HTMLRewriter injects approved fixes and counts AI crawler hits; Miniflare tests
- [ ] GitHub PR fixes for Next.js and static sites, behind an interface (GitHub App or token)
- [ ] Content Studio: answer-first rewrite (first sentence, question headings, self-contained passages, FAQ from the site's real radar prompts), English and Arabic, diff view, approval before apply
- [ ] Verification: re-fetch raw HTML and confirm the fix is visible without JavaScript
- [ ] Acceptance: an applied fix is confirmed in the raw HTML; rollback restores the original

## Phase 4 — Scale

- [ ] Mention Map: domains AI engines cite for competitors, as a list of places the client should be mentioned
- [ ] AI bot visits dashboard (which crawler, how many times this week, which pages)
- [ ] Agency mode: multi-client workspace, white-label Arabic and English PDF reports with the agency logo
- [ ] `packages/mcp`: tools `audit_url`, `get_fixes`, `radar_summary` (API-key auth), publishable to npm, documented for Cursor and Claude Code
- [ ] Public monthly leaderboards in `apps/web` (English and Arabic), built from real radar data, with methodology notes
- [ ] "AI-ready" badge (reuse `badge.svg`) that sites can embed, linking to their public score page
- [ ] Acceptance: all packages tested; leaderboard and badge pages are static, indexable, and in the sitemap
