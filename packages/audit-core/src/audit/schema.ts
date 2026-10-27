/**
 * JSON-LD analysis against Google Search structured-data documentation.
 * Required = needed for rich-result eligibility; recommended = improves completeness.
 */
import type { JsonLdBlock } from './html';

export interface SchemaNode {
  types: string[];
  data: Record<string, unknown>;
  topLevel: boolean;
}

export interface SchemaProblem {
  type: string;
  level: 'required' | 'recommended';
  property: string;
}

export interface SchemaAnalysis {
  blocks: number;
  parseErrors: string[];
  nodes: SchemaNode[];
  types: string[];
  problems: SchemaProblem[];
  hasContext: boolean;
  identity: { type: string; name: string | null; sameAs: string[]; hasLogo: boolean; hasUrl: boolean } | null;
  hasWebSite: boolean;
  usesIds: boolean;
  dates: { published: string | null; modified: string | null };
  author: string | null;
  deprecatedTypes: string[];
}

const ORG_TYPES = new Set([
  'Organization', 'Corporation', 'LocalBusiness', 'OnlineBusiness', 'OnlineStore', 'NGO', 'EducationalOrganization',
  'MedicalOrganization', 'NewsMediaOrganization', 'GovernmentOrganization', 'SportsOrganization', 'Airline',
]);
const LOCAL_TYPES = new Set([
  'LocalBusiness', 'Restaurant', 'Store', 'Dentist', 'MedicalClinic', 'Physician', 'Hospital', 'LegalService', 'Attorney',
  'AutoRepair', 'BeautySalon', 'HealthAndBeautyBusiness', 'HomeAndConstructionBusiness', 'LodgingBusiness', 'Hotel',
  'RealEstateAgent', 'FinancialService', 'FoodEstablishment', 'CafeOrCoffeeShop', 'Bakery', 'ProfessionalService',
  'MedicalBusiness', 'DaySpa', 'GymOrFitnessCenter', 'SportsActivityLocation', 'TravelAgency', 'Pharmacy',
]);
const ARTICLE_TYPES = new Set(['Article', 'NewsArticle', 'BlogPosting', 'TechArticle', 'ScholarlyArticle', 'Report']);
const SOFTWARE_TYPES = new Set(['SoftwareApplication', 'WebApplication', 'MobileApplication', 'VideoGame']);

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function typeList(node: Record<string, unknown>): string[] {
  return asArray(node['@type'] as string | string[]).map((t) => String(t).replace(/^https?:\/\/schema\.org\//, ''));
}

function has(node: Record<string, unknown>, prop: string): boolean {
  const value = node[prop];
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function firstObject(value: unknown): Record<string, unknown> | null {
  const item = asArray(value as unknown)[0];
  return item && typeof item === 'object' ? (item as Record<string, unknown>) : null;
}

function text(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  const obj = firstObject(value);
  if (obj && typeof obj.name === 'string') return obj.name;
  return null;
}

function collect(value: unknown, topLevel: boolean, out: SchemaNode[], depth = 0): void {
  if (depth > 8 || value === null || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item) => collect(item, topLevel, out, depth + 1));
    return;
  }
  const node = value as Record<string, unknown>;
  if (Array.isArray(node['@graph'])) {
    (node['@graph'] as unknown[]).forEach((item) => collect(item, true, out, depth + 1));
  }
  const types = typeList(node);
  if (types.length > 0) out.push({ types, data: node, topLevel });
  Object.entries(node).forEach(([key, child]) => {
    if (key === '@graph' || key.startsWith('@')) return;
    if (child && typeof child === 'object') collect(child, false, out, depth + 1);
  });
}

function requireProps(node: SchemaNode, type: string, required: string[][], recommended: string[], problems: SchemaProblem[]): void {
  for (const alternatives of required) {
    if (!alternatives.some((prop) => has(node.data, prop))) {
      problems.push({ type, level: 'required', property: alternatives.join(' or ') });
    }
  }
  if (!node.topLevel) return;
  for (const prop of recommended) {
    if (!has(node.data, prop)) problems.push({ type, level: 'recommended', property: prop });
  }
}

/** Nested stubs like `{"@type":"Product","url":"…"}` (variant links, itemReviewed) point elsewhere; Google does not validate them as standalone items. */
function isReference(node: SchemaNode): boolean {
  if (node.topLevel) return false;
  const keys = Object.keys(node.data).filter((k) => !k.startsWith('@'));
  return keys.length <= 2 && keys.every((k) => ['url', 'name', 'sameAs', 'identifier'].includes(k));
}

function validateNode(node: SchemaNode, problems: SchemaProblem[]): void {
  const types = node.types;
  const is = (set: Set<string>) => types.some((t) => set.has(t));
  const label = types[0];

  if (types.includes('Product') || types.includes('ProductGroup')) {
    requireProps(node, label, [['name'], ['offers', 'review', 'aggregateRating']], ['image', 'description', 'brand', 'sku'], problems);
    const offer = firstObject(node.data.offers);
    if (offer) {
      const offerTypes = typeList(offer);
      if (offerTypes.includes('AggregateOffer')) {
        if (!has(offer, 'lowPrice')) problems.push({ type: 'AggregateOffer', level: 'required', property: 'lowPrice' });
      } else if (!has(offer, 'price') && !has(offer, 'priceSpecification')) {
        problems.push({ type: 'Offer', level: 'required', property: 'price' });
      }
      if (!has(offer, 'priceCurrency') && !has(offer, 'priceSpecification')) problems.push({ type: 'Offer', level: 'required', property: 'priceCurrency' });
      if (!has(offer, 'availability')) problems.push({ type: 'Offer', level: 'recommended', property: 'availability' });
    }
  } else if (is(SOFTWARE_TYPES)) {
    requireProps(node, label, [['name'], ['offers']], ['applicationCategory', 'operatingSystem'], problems);
    if (!has(node.data, 'aggregateRating') && !has(node.data, 'review')) {
      problems.push({ type: label, level: 'recommended', property: 'aggregateRating or review (needed for star rich results — only from real reviews)' });
    }
    const offer = firstObject(node.data.offers);
    if (offer && !has(offer, 'price')) problems.push({ type: 'Offer', level: 'required', property: 'price' });
  } else if (is(ARTICLE_TYPES)) {
    requireProps(node, label, [], ['headline', 'image', 'datePublished', 'dateModified', 'author'], problems);
    const author = firstObject(node.data.author);
    if (author && !has(author, 'name')) problems.push({ type: 'author', level: 'recommended', property: 'name' });
  } else if (types.includes('BreadcrumbList')) {
    const items = asArray(node.data.itemListElement as unknown[]);
    if (items.length === 0) problems.push({ type: 'BreadcrumbList', level: 'required', property: 'itemListElement' });
    items.forEach((raw, index) => {
      const item = raw as Record<string, unknown>;
      if (!item || typeof item !== 'object') return;
      if (!has(item, 'position')) problems.push({ type: `ListItem #${index + 1}`, level: 'required', property: 'position' });
      if (!has(item, 'name') && !(firstObject(item.item) && has(firstObject(item.item) as Record<string, unknown>, 'name'))) {
        problems.push({ type: `ListItem #${index + 1}`, level: 'required', property: 'name' });
      }
      if (index < items.length - 1 && !has(item, 'item')) problems.push({ type: `ListItem #${index + 1}`, level: 'required', property: 'item' });
    });
  } else if (types.includes('FAQPage')) {
    const questions = asArray(node.data.mainEntity as unknown[]);
    if (questions.length === 0) problems.push({ type: 'FAQPage', level: 'required', property: 'mainEntity' });
    questions.forEach((raw, index) => {
      const q = raw as Record<string, unknown>;
      if (!q || typeof q !== 'object') return;
      if (!has(q, 'name')) problems.push({ type: `Question #${index + 1}`, level: 'required', property: 'name' });
      const answer = firstObject(q.acceptedAnswer);
      if (!answer || !has(answer, 'text')) problems.push({ type: `Question #${index + 1}`, level: 'required', property: 'acceptedAnswer.text' });
    });
  } else if (types.includes('Event') || types.some((t) => t.endsWith('Event'))) {
    requireProps(node, label, [['name'], ['startDate'], ['location']], ['endDate', 'eventStatus', 'image', 'offers', 'organizer'], problems);
  } else if (types.includes('Recipe')) {
    requireProps(node, label, [['name'], ['image']], ['author', 'recipeIngredient', 'recipeInstructions', 'totalTime'], problems);
  } else if (types.includes('VideoObject')) {
    requireProps(node, label, [['name'], ['thumbnailUrl'], ['uploadDate']], ['description', 'contentUrl', 'embedUrl', 'duration'], problems);
  } else if (types.includes('JobPosting')) {
    requireProps(node, label, [['title'], ['description'], ['datePosted'], ['hiringOrganization'], ['jobLocation', 'applicantLocationRequirements']], ['validThrough', 'employmentType', 'baseSalary'], problems);
  } else if (types.includes('Course')) {
    requireProps(node, label, [['name'], ['description']], ['provider', 'offers'], problems);
  } else if (is(LOCAL_TYPES)) {
    requireProps(node, label, [['name'], ['address']], ['telephone', 'openingHoursSpecification', 'geo', 'url', 'image'], problems);
  } else if (is(ORG_TYPES) && node.topLevel) {
    requireProps(node, label, [['name']], ['url', 'logo', 'sameAs'], problems);
  } else if (types.includes('WebSite') && node.topLevel) {
    requireProps(node, label, [['name'], ['url']], [], problems);
  } else if (types.includes('Person') && node.topLevel) {
    requireProps(node, label, [['name']], ['url', 'sameAs'], problems);
  } else if (types.includes('Review')) {
    requireProps(node, label, [['author'], ['reviewRating'], ['itemReviewed']], [], problems);
  }
}

export function analyzeSchema(blocks: JsonLdBlock[]): SchemaAnalysis {
  const parseErrors = blocks.filter((b) => b.error).map((b) => b.error as string);
  const nodes: SchemaNode[] = [];
  let hasContext = false;
  let usesIds = false;
  blocks.forEach((block) => {
    if (!block.data) return;
    const roots = asArray(block.data as unknown);
    roots.forEach((root) => {
      if (root && typeof root === 'object') {
        const ctx = (root as Record<string, unknown>)['@context'];
        if (typeof ctx === 'string' ? /schema\.org/i.test(ctx) : JSON.stringify(ctx || '').includes('schema.org')) hasContext = true;
      }
    });
    if (JSON.stringify(block.data).includes('"@id"')) usesIds = true;
    collect(block.data, true, nodes);
  });

  const problems: SchemaProblem[] = [];
  nodes.filter((node) => !isReference(node)).forEach((node) => validateNode(node, problems));

  const types = [...new Set(nodes.filter((n) => n.topLevel).flatMap((n) => n.types))];
  const allTypes = [...new Set(nodes.flatMap((n) => n.types))];

  const identityNode = nodes.find((n) => n.topLevel && n.types.some((t) => ORG_TYPES.has(t) || LOCAL_TYPES.has(t))) ||
    nodes.find((n) => n.topLevel && n.types.includes('Person')) ||
    nodes.find((n) => n.types.some((t) => ORG_TYPES.has(t)) && has(n.data, 'sameAs'));
  const identity = identityNode
    ? {
        type: identityNode.types[0],
        name: text(identityNode.data.name),
        sameAs: asArray(identityNode.data.sameAs as string[]).filter((s) => typeof s === 'string' && /^https?:\/\//.test(s)),
        hasLogo: has(identityNode.data, 'logo') || has(identityNode.data, 'image'),
        hasUrl: has(identityNode.data, 'url'),
      }
    : null;

  const dated = nodes.find((n) => has(n.data, 'dateModified') || has(n.data, 'datePublished'));
  const authored = nodes.find((n) => has(n.data, 'author'));

  return {
    blocks: blocks.length,
    parseErrors,
    nodes,
    types: types.length > 0 ? types : allTypes,
    problems,
    hasContext,
    identity,
    hasWebSite: allTypes.includes('WebSite'),
    usesIds,
    dates: {
      published: dated ? (text(dated.data.datePublished) ?? null) : null,
      modified: dated ? (text(dated.data.dateModified) ?? null) : null,
    },
    author: authored ? text(authored.data.author) : null,
    deprecatedTypes: allTypes.filter((t) => t === 'HowTo' || t === 'SpecialAnnouncement' || t === 'ClaimReview'),
  };
}

export const SCHEMA_SETS = { ORG_TYPES, LOCAL_TYPES, ARTICLE_TYPES, SOFTWARE_TYPES };
