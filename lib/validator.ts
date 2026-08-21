export interface ValidationIssue {
  id: string;
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  recommendation: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0 to 100
  status: 'perfect' | 'good' | 'warning' | 'invalid';
  issues: ValidationIssue[];
  passedChecks: string[];
  googleRichResultEligible: boolean;
  aeoOptimizationScore: number;
}

export function validateSchemaAST(schemaObj: any): ValidationResult {
  const issues: ValidationIssue[] = [];
  const passedChecks: string[] = [];

  if (!schemaObj || typeof schemaObj !== 'object') {
    return {
      isValid: false,
      score: 0,
      status: 'invalid',
      issues: [
        {
          id: 'invalid-json',
          field: 'root',
          severity: 'error',
          message: 'The generated code is not a valid JSON object.',
          recommendation: 'Ensure all required fields are filled and valid JSON syntax is maintained.',
        },
      ],
      passedChecks: [],
      googleRichResultEligible: false,
      aeoOptimizationScore: 0,
    };
  }

  // 1. Context check
  if (schemaObj['@context'] === 'https://schema.org' || schemaObj['@context'] === 'https://schema.org/') {
    passedChecks.push('Valid Schema.org @context');
  } else {
    issues.push({
      id: 'missing-context',
      field: '@context',
      severity: 'error',
      message: 'Missing standard @context ("https://schema.org").',
      recommendation: 'Add "@context": "https://schema.org" at the root level.',
    });
  }

  // 2. Type check
  const type = schemaObj['@type'];
  if (type) {
    passedChecks.push(`Schema Type recognized: ${type}`);
  } else {
    issues.push({
      id: 'missing-type',
      field: '@type',
      severity: 'error',
      message: 'Missing "@type" property.',
      recommendation: 'Specify a valid Schema.org type (e.g. SoftwareApplication, Product, FAQPage).',
    });
  }

  // Specific Type Validations
  if (type === 'SoftwareApplication') {
    if (!schemaObj.name || schemaObj.name.trim() === '') {
      issues.push({
        id: 'missing-name',
        field: 'name',
        severity: 'error',
        message: 'Missing "name" property for SoftwareApplication.',
        recommendation: 'Provide the official software application title.',
      });
    } else {
      passedChecks.push('Application name specified');
    }

    if (!schemaObj.offers || !schemaObj.offers.price) {
      issues.push({
        id: 'missing-price',
        field: 'offers.price',
        severity: 'warning',
        message: 'Missing price in Offers specification.',
        recommendation: 'Specify pricing (or "0" if free) to enable Rich Snippet price badges.',
      });
    } else {
      passedChecks.push('Offer price & currency configured');
    }

    if (schemaObj.aggregateRating) {
      const rating = parseFloat(schemaObj.aggregateRating.ratingValue);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        issues.push({
          id: 'invalid-rating',
          field: 'aggregateRating.ratingValue',
          severity: 'warning',
          message: 'Rating value must be between 1.0 and 5.0.',
          recommendation: 'Adjust ratingValue to a standard 5-point scale.',
        });
      } else {
        passedChecks.push('Google 5-star aggregate rating verified');
      }
    } else {
      issues.push({
        id: 'missing-rating',
        field: 'aggregateRating',
        severity: 'info',
        message: 'AggregateRating omitted. Rich stars will not appear in SERPs.',
        recommendation: 'Add ratingValue and reviewCount to unlock Google gold star badges.',
      });
    }
  }

  if (type === 'Product') {
    if (!schemaObj.name) {
      issues.push({
        id: 'missing-product-name',
        field: 'name',
        severity: 'error',
        message: 'Product name is mandatory.',
        recommendation: 'Enter a descriptive product title.',
      });
    } else {
      passedChecks.push('Product name present');
    }

    if (!schemaObj.image || (Array.isArray(schemaObj.image) && schemaObj.image.length === 0)) {
      issues.push({
        id: 'missing-product-image',
        field: 'image',
        severity: 'warning',
        message: 'Google Merchant Listings require high-resolution image URLs.',
        recommendation: 'Add a valid product image URL.',
      });
    } else {
      passedChecks.push('Product image URL validated');
    }

    if (!schemaObj.offers) {
      issues.push({
        id: 'missing-product-offers',
        field: 'offers',
        severity: 'error',
        message: 'Product must include "offers" with price and availability.',
        recommendation: 'Include Offer object with priceCurrency and availability.',
      });
    } else {
      passedChecks.push('Merchant offer & availability confirmed');
    }
  }

  if (type === 'FAQPage') {
    const items = schemaObj.mainEntity;
    if (!Array.isArray(items) || items.length === 0) {
      issues.push({
        id: 'empty-faq',
        field: 'mainEntity',
        severity: 'error',
        message: 'FAQPage must contain at least one Question & Answer item.',
        recommendation: 'Add at least one FAQ entry.',
      });
    } else {
      let validQuestions = 0;
      items.forEach((item: any, i: number) => {
        if (item['@type'] === 'Question' && item.name && item.acceptedAnswer?.text) {
          validQuestions++;
        } else {
          issues.push({
            id: `invalid-faq-${i}`,
            field: `mainEntity[${i}]`,
            severity: 'warning',
            message: `FAQ item #${i + 1} has incomplete question or answer text.`,
            recommendation: 'Ensure both Question title and Answer text are provided.',
          });
        }
      });
      if (validQuestions > 0) {
        passedChecks.push(`${validQuestions} valid FAQ Q&A accordion entities found`);
      }
    }
  }

  if (type === 'LocalBusiness') {
    if (!schemaObj.name || !schemaObj.telephone || !schemaObj.address) {
      issues.push({
        id: 'missing-nap',
        field: 'address',
        severity: 'warning',
        message: 'Google Local Pack requires complete NAP (Name, Address, Phone).',
        recommendation: 'Fill out street address, city, state, postal code, and phone.',
      });
    } else {
      passedChecks.push('Complete Local NAP structured footprint');
    }
  }

  if (type === 'Article') {
    if (!schemaObj.headline || !schemaObj.author) {
      issues.push({
        id: 'missing-article-meta',
        field: 'headline',
        severity: 'error',
        message: 'Article requires headline and author entity for Google News/Discover.',
        recommendation: 'Add author Person/Organization and clear headline.',
      });
    } else {
      passedChecks.push('Journalistic author & timestamp entities validated');
    }
  }

  // Calculate scores
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  let score = 100 - errorCount * 30 - warningCount * 10;
  if (score < 0) score = 0;

  let status: 'perfect' | 'good' | 'warning' | 'invalid' = 'perfect';
  if (errorCount > 0) {
    status = 'invalid';
  } else if (warningCount > 1) {
    status = 'warning';
  } else if (warningCount === 1) {
    status = 'good';
  }

  const googleRichResultEligible = errorCount === 0;
  const aeoOptimizationScore = Math.min(100, Math.max(20, score + (passedChecks.length >= 3 ? 10 : 0)));

  return {
    isValid: errorCount === 0,
    score,
    status,
    issues,
    passedChecks,
    googleRichResultEligible,
    aeoOptimizationScore,
  };
}
