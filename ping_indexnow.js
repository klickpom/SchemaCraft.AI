const https = require('https');

const host = 'schemacraft-ai.site';
const key = '4a8c9b2e1f3d4e5a6b7c8d9e0f1a2b3c';
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  `https://${host}/`,
  `https://${host}/schema/shopify-product/`,
  `https://${host}/schema/nextjs-software/`,
  `https://${host}/schema/saas-faq/`,
  `https://${host}/schema/local-seo-schema/`,
  `https://${host}/schema/course-education-schema/`,
  `https://${host}/schema/article-google-discover-schema/`,
  `https://${host}/schema/woocommerce-product-schema/`,
  `https://${host}/schema/howto-step-by-step-schema/`,
  `https://${host}/schema/organization-brand-schema/`,
  `https://${host}/schema/event-ticket-schema/`,
  `https://${host}/schema/medical-clinic-doctor-schema/`,
  `https://${host}/schema/legal-law-firm-schema/`,
  `https://${host}/schema/wordpress-yoast-alternative-schema/`,
  `https://${host}/schema/recipe-food-nutrition-schema/`,
  `https://${host}/schema/video-youtube-embed-schema/`,
];

const postData = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList,
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('📡 Sending IndexNow instant crawl ping for 7 URLs to Bing & AI search engines...');

const req = https.request(options, (res) => {
  console.log(`IndexNow API Response Status: ${res.statusCode} ${res.statusMessage}`);
  res.on('data', (d) => process.stdout.write(d));
  res.on('end', () => console.log('\n✓ IndexNow ping complete. Search engines notified for instant indexing.'));
});

req.on('error', (e) => {
  console.error(`IndexNow error: ${e.message}`);
});

req.write(postData);
req.end();
