/**
 * Formatter helpers: frontmatter handling and style-block formatting.
 */

/**
 * Reattach Nunjucks interpolation trim dashes that were split away from `{{` / `}}`.
 * Older markup_fmt versions turned `{{- name -}}` into `{{ - name - }}` or
 *
 *     {{
 *       - name -
 *     }}
 *
 * which is invalid Nunjucks (the `-` must be adjacent to the braces).
 * Only interpolations with a dash at both ends are rewritten, so unary minus
 * like `{{ -5 }}` is left unchanged.
 */
function repairSplitInterpolationTrim(content) {
  return content.replace(/\{\{([\s\S]*?)\}\}/g, (full, inner) => {
    const detached = /^(\s*)-([\s\S]*)-(\s*)$/.exec(inner);
    if (!detached) return full;
    const [, lead, body, trail] = detached;
    if (lead.length === 0 && trail.length === 0) return full;

    const expr = body.trim();
    if (!expr.includes('\n')) {
      return `{{- ${expr} -}}`;
    }
    const kept = body.replace(/^\s*\n/, '').replace(/\n[ \t]*$/, '');
    return `{{-\n${kept}\n-}}`;
  });
}

function formatContent(content, filename, runFn) {
  const fmMatch = content.match(/^(---(?:json|js)?\s*\n)([\s\S]*?)(\n---\s*$)/m);
  let formattedText = content;
  if (fmMatch) {
    const body = fmMatch[2];
    const typeMatch = fmMatch[1].match(/^---(json|js)/);
    if (typeMatch) {
      const typ = typeMatch[1] === 'js' ? 'file.js' : 'file.json';
      const formattedBody = runFn(body, typ);
      formattedText = content.replace(body, formattedBody);
    } else {
      const formattedBody = runFn(body, 'file.yaml');
      formattedText = content.replace(body, formattedBody);
    }
  }

  return repairSplitInterpolationTrim(runFn(formattedText, filename || 'file.njk'));
}

/** Async version for async runFn (e.g. formatWithDprint). */
async function formatContentAsync(content, filename, runFn) {
  const fmMatch = content.match(/^(---(?:json|js)?\s*\n)([\s\S]*?)(\n---\s*$)/m);
  let formattedText = content;
  if (fmMatch) {
    const body = fmMatch[2];
    const typeMatch = fmMatch[1].match(/^---(json|js)/);
    if (typeMatch) {
      const typ = typeMatch[1] === 'js' ? 'file.js' : 'file.json';
      const formattedBody = await runFn(body, typ);
      formattedText = content.replace(body, formattedBody);
    } else {
      const formattedBody = await runFn(body, 'file.yaml');
      formattedText = content.replace(body, formattedBody);
    }
  }

  const final = await runFn(formattedText, filename || 'file.njk');
  return repairSplitInterpolationTrim(final);
}

function formatStyleBlocks(content, formatCssFn) {
  return content.replace(/<style(\s[^>]*)?>([\s\S]*?)<\/style>/gi, (match, attrs, css) => {
    try {
      const formatted = formatCssFn(css.trim());
      const attrPart = attrs ? attrs : '';
      return `<style${attrPart}>\n${formatted}\n</style>`;
    } catch {
      return match;
    }
  });
}

async function formatStyleBlocksAsync(content, formatCssFn) {
  const styleRegex = /<style(\s[^>]*)?>([\s\S]*?)<\/style>/gi;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = styleRegex.exec(content)) !== null) {
    parts.push(content.slice(lastIndex, match.index));
    const attrs = match[1] ? match[1] : '';
    const css = match[2].trim();
    try {
      const formatted = await Promise.resolve(formatCssFn(css));
      parts.push(`<style${attrs}>\n${formatted}\n</style>`);
    } catch {
      parts.push(match[0]);
    }
    lastIndex = styleRegex.lastIndex;
  }
  parts.push(content.slice(lastIndex));
  return parts.join('');
}

module.exports = {
  formatContent,
  formatContentAsync,
  formatStyleBlocks,
  formatStyleBlocksAsync,
  repairSplitInterpolationTrim,
};
