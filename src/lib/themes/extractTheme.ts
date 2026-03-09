import type { Theme } from './types';

const SELECTOR_MAP: Record<string, string[]> = {
  container: ['#js_content', '.rich_media_content', 'section', 'body'],
  h1: ['h1'],
  h2: ['h2'],
  h3: ['h3'],
  h4: ['h4'],
  p: ['p'],
  strong: ['strong', 'b'],
  em: ['em', 'i'],
  a: ['a'],
  ul: ['ul'],
  ol: ['ol'],
  li: ['li'],
  blockquote: ['blockquote'],
  code: ['code'],
  pre: ['pre'],
  hr: ['hr'],
  img: ['img'],
  table: ['table'],
  th: ['th'],
  td: ['td'],
  tr: ['tr'],
};

const STYLE_PROPS: Record<string, string[]> = {
  container: ['font-family', 'font-size', 'line-height', 'color', 'background-color', 'padding', 'max-width', 'word-wrap', 'letter-spacing'],
  h1: ['font-size', 'font-weight', 'color', 'line-height', 'margin', 'letter-spacing', 'border-bottom', 'padding-bottom', 'text-align'],
  h2: ['font-size', 'font-weight', 'color', 'line-height', 'margin', 'border-bottom', 'padding-bottom', 'text-align'],
  h3: ['font-size', 'font-weight', 'color', 'line-height', 'margin'],
  h4: ['font-size', 'font-weight', 'color', 'line-height', 'margin'],
  p: ['margin', 'line-height', 'color', 'text-indent', 'letter-spacing'],
  strong: ['font-weight', 'color', 'background-color', 'padding', 'border-radius'],
  em: ['font-style', 'color'],
  a: ['color', 'text-decoration', 'border-bottom', 'padding-bottom'],
  ul: ['margin', 'padding-left'],
  ol: ['margin', 'padding-left'],
  li: ['margin', 'line-height', 'color'],
  blockquote: ['margin', 'padding', 'background-color', 'border-left', 'color', 'border-radius', 'font-style'],
  code: ['font-family', 'padding', 'background-color', 'color', 'border-radius', 'font-size', 'line-height'],
  pre: ['margin', 'padding', 'background-color', 'border-radius', 'overflow-x', 'font-size', 'line-height'],
  hr: ['margin', 'border', 'height', 'background-color', 'width'],
  img: ['max-width', 'height', 'display', 'margin', 'border-radius'],
  table: ['width', 'margin', 'border-collapse', 'font-size'],
  th: ['background-color', 'padding', 'text-align', 'font-weight', 'color', 'border'],
  td: ['padding', 'border', 'color'],
  tr: ['border'],
};

const FALLBACK_STYLES: Record<string, string> = {
  container: 'max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.7 !important; color: #333 !important; background-color: #fff !important; word-wrap: break-word;',
  h1: 'font-size: 32px; font-weight: 700; color: #111 !important; line-height: 1.3 !important; margin: 38px 0 16px;',
  h2: 'font-size: 26px; font-weight: 600; color: #111 !important; line-height: 1.35 !important; margin: 32px 0 16px;',
  h3: 'font-size: 21px; font-weight: 600; color: #333 !important; line-height: 1.4 !important; margin: 28px 0 14px;',
  h4: 'font-size: 18px; font-weight: 600; color: #333 !important; line-height: 1.4 !important; margin: 24px 0 12px;',
  p: 'margin: 18px 0 !important; line-height: 1.7 !important; color: #333 !important;',
  strong: 'font-weight: 700; color: #000 !important;',
  em: 'font-style: italic; color: #666 !important;',
  a: 'color: #576b95 !important; text-decoration: none; border-bottom: 1px solid #576b95; padding-bottom: 1px;',
  ul: 'margin: 16px 0; padding-left: 28px;',
  ol: 'margin: 16px 0; padding-left: 28px;',
  li: 'margin: 8px 0; line-height: 1.7 !important; color: #333 !important;',
  blockquote: 'margin: 24px 0; padding: 16px 20px; background-color: #f5f5f5 !important; border-left: 4px solid #ddd; color: #555 !important; border-radius: 4px;',
  code: 'font-family: "SF Mono", Consolas, monospace; padding: 3px 6px; background-color: #f5f5f5 !important; color: #c7254e !important; border-radius: 4px; font-size: 12px !important; line-height: 1.5 !important;',
  pre: 'margin: 24px 0; padding: 20px; background-color: #f5f5f5 !important; border-radius: 8px; overflow-x: auto; font-size: 12px !important; line-height: 1.5 !important;',
  hr: 'margin: 36px auto; border: none; height: 1px; background-color: #eaeaea !important; width: 100%;',
  img: 'max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 4px;',
  table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;',
  th: 'background-color: #f5f5f5 !important; padding: 12px 16px; text-align: left; font-weight: 600; color: #333 !important; border: 1px solid #e0e0e0;',
  td: 'padding: 12px 16px; border: 1px solid #e0e0e0; color: #333 !important;',
  tr: 'border: none;',
};

function extractInlineStyle(el: Element, allowedProps: string[]): string {
  const styleAttr = el.getAttribute('style');
  if (!styleAttr) return '';

  const parts: string[] = [];
  for (const prop of allowedProps) {
    const regex = new RegExp(`(?:^|;)\\s*(${prop}(?:-[a-z]+)?)\\s*:\\s*([^;]+)`, 'gi');
    let match;
    while ((match = regex.exec(styleAttr)) !== null) {
      parts.push(`${match[1].trim()}: ${match[2].trim()}`);
    }
  }
  return parts.join('; ');
}

function findStyledElement(doc: Document, selectors: string[]): Element | null {
  for (const selector of selectors) {
    const els = doc.querySelectorAll(selector);
    for (const el of Array.from(els)) {
      if (el.getAttribute('style')) return el;
    }
    if (els.length > 0) return els[0];
  }
  return null;
}

function inferHeadingsFromSections(doc: Document): Map<string, Element> {
  const map = new Map<string, Element>();
  const sections = doc.querySelectorAll('section[style]');

  for (const sec of Array.from(sections)) {
    const style = sec.getAttribute('style') || '';
    const fontSizeMatch = style.match(/font-size:\s*(\d+)px/);
    if (!fontSizeMatch) continue;
    const fontSize = parseInt(fontSizeMatch[1], 10);
    const textContent = sec.textContent?.trim() || '';
    if (textContent.length > 100 || textContent.length === 0) continue;

    if (fontSize >= 28 && !map.has('h1')) map.set('h1', sec);
    else if (fontSize >= 22 && fontSize < 28 && !map.has('h2')) map.set('h2', sec);
    else if (fontSize >= 18 && fontSize < 22 && !map.has('h3')) map.set('h3', sec);
  }
  return map;
}

function ensureImportant(styleStr: string, props: string[]): string {
  let result = styleStr;
  for (const prop of props) {
    const regex = new RegExp(`(${prop}\\s*:\\s*[^;!]+)(?!\\s*!important)`, 'gi');
    result = result.replace(regex, '$1 !important');
  }
  return result;
}

export function extractThemeFromHtml(htmlString: string, themeName: string): Theme {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const styles: Record<string, string> = {};
  const inferredHeadings = inferHeadingsFromSections(doc);

  for (const [key, selectors] of Object.entries(SELECTOR_MAP)) {
    const allowedProps = STYLE_PROPS[key] || [];
    let el = findStyledElement(doc, selectors);

    if (!el && inferredHeadings.has(key)) {
      el = inferredHeadings.get(key)!;
    }

    if (el) {
      let extracted = extractInlineStyle(el, allowedProps);
      if (extracted) {
        extracted = ensureImportant(extracted, ['color', 'background-color', 'line-height']);
        styles[key] = extracted;
      }
    }
  }

  for (const key of Object.keys(FALLBACK_STYLES)) {
    if (!styles[key]) {
      styles[key] = FALLBACK_STYLES[key];
    }
  }

  if (!styles.container.includes('max-width')) {
    styles.container = 'max-width: 100%; ' + styles.container;
  }
  if (!styles.container.includes('word-wrap')) {
    styles.container += '; word-wrap: break-word;';
  }
  if (!styles.container.includes('margin')) {
    styles.container = 'margin: 0 auto; ' + styles.container;
  }

  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    name: themeName,
    description: '从 HTML 文件提取的自定义主题',
    styles,
  };
}
