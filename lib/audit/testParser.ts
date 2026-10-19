import { DOMParser as LinkedomParser } from 'linkedom';

const TAG = /<([a-zA-Z][^\s/>]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
const ATTR = /(\s+)([^\s"'>/=]+)((?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)/g;

/** linkedom keeps attribute case (`charSet`, `hrefLang`); browsers lowercase it. Match the browser. */
export class TestParser {
  parseFromString(html: string, type: string): Document {
    const normalized = html.replace(TAG, (_m, name: string, attrs: string, close: string) =>
      `<${name}${attrs.replace(ATTR, (_a, ws: string, attr: string, value: string) => `${ws}${attr.toLowerCase()}${value}`)}${close ? ' /' : ''}>`,
    );
    return new LinkedomParser().parseFromString(normalized, type as 'text/html') as unknown as Document;
  }
}
