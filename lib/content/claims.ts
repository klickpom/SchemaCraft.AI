/**
 * Every claim here must be defensible. No invented numbers.
 * Marketing copy that cannot be sourced must be qualitative, or it does not ship.
 */
export const CLAIMS = {
  schemaStandard: 'current Schema.org vocabulary',
  validatorRunsInBrowser:
    'JSON-LD is checked in your browser — no network round-trip for validation.',
  validatorVsGoogle:
    "Checked against Google's documented required and recommended properties for this type. Google does not guarantee that valid markup produces a rich result.",
  indexNow:
    'IndexNow notifies Bing and Yandex that a URL changed. Google does not participate in IndexNow.',
  richResultsDisclaimer:
    'Valid markup does not guarantee a rich result. Eligibility also depends on Google policies, crawl, and ranking.',
  gptBotOnOurSite:
    "SchemaCraft's own robots.txt allows GPTBot because we want this documentation available to foundation-model corpora. The generator still defaults to blocking training crawlers on customer sites — that is a choice, not a requirement.",
  wafSpoofWarning:
    "User-agent strings are trivially spoofable. For production, verify crawler identity using each vendor's published IP ranges or reverse-DNS method — a user-agent allow-list alone is not a security control.",
  samplePreviewLabel: 'Sample preview data',
  demoAuditLabel: 'Demo audit',
} as const;
