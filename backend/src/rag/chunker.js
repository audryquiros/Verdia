export function normalizeText(text = '') {
  return text
    .replace(/\\r\\n/g, '\\n')
    .replace(/[ \\t]+/g, ' ')
    .replace(/\\n{3,}/g, '\\n\\n')
    .trim();
}

export function chunkText(text, options = {}) {
  const normalized = normalizeText(text);
  const size = options.size ?? 900;
  const overlap = options.overlap ?? 120;

  if (!normalized) return [];
  if (overlap >= size) {
    throw new Error('chunk overlap must be smaller than chunk size');
  }

  const chunks = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + size, normalized.length);

    if (end < normalized.length) {
      const boundary = normalized.lastIndexOf(' ', end);
      if (boundary > start + Math.floor(size * 0.6)) {
        end = boundary;
      }
    }

    const content = normalized.slice(start, end).trim();
    if (content) {
      chunks.push({
        index: chunks.length,
        content,
        startOffset: start,
        endOffset: end,
      });
    }

    if (end >= normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
