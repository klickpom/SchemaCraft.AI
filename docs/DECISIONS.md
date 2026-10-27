# Decisions

Each line is a choice and the reason it was made. Add new lines at the bottom. Do not rewrite old lines when a later phase changes course; add a new line.

## 2026-10-28 — Phase 0

- npm workspaces, not pnpm or Turborepo: the repo already has an npm lockfile, and Phase 0 only needs two packages.
- `packages/audit-core` is TypeScript source consumed through `package.json` exports and Next `transpilePackages`: Vitest and the static site share one copy, with no second compile step to drift.
- `lib/seo`, `lib/i18n`, `lib/content`, `lib/uiLang`, `lib/schemaTypes`, `lib/seoData`, `lib/extractor`, `lib/validator`, and `lib/translations` stay in `apps/web`: they are this site's copy and URL policy, and the phase names only `lib/audit`, `lib/bots`, and `lib/tools` for the shared package.
- Audit-core imports are relative inside the package, and the site imports `@schemacraft/audit-core/...`: later apps can depend on the package without the website's `@/` alias.
- `generate_favicons.js` moves with `apps/web`: it writes `public/` and `app/` next to itself, and leaving it at the repo root would create a second site tree.
- `ping_indexnow.js` stays at the repo root: it is an ops script, not build output, and Phase 0 does not change IndexNow.
- Root `api/audit.php` and root `.htaccess` are removed from `main` because they are byte-identical to `apps/web/public/api/audit.php` and `apps/web/public/.htaccess`, which Next copies into `out/`.
- Build output leaves `main` in a normal commit, not a history rewrite: a rewrite would need a force-push, and the old blobs stay recoverable in history.
- The `deploy` branch receives a new commit of the static tree (no orphan branch, no force-push): Hostinger should deploy that branch, while `main` stays the source repo.
- The Action publishes only on a push to `main`: pull requests run install, test, and build, and do not move the live branch.
- `.env.example` lists `SC_AUDIT_FIXTURES` only: it is the only environment variable in the tree, and it is an optional local path, not a secret.
- The public URL set is frozen in `apps/web/lib/seo/public-urls.txt` and checked in Vitest and in CI: route order may differ by filesystem, and the guard compares the sorted set.
