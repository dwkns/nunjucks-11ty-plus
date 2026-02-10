/**
 * Formatter helpers: frontmatter handling and style-block formatting.
 */
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

  return runFn(formattedText, filename || 'file.njk');
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
  return final;
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

module.exports = { formatContent, formatContentAsync, formatStyleBlocks, formatStyleBlocksAsync };
