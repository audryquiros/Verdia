export function normalizeText(text = '') {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function findBoundary(text, target, minEnd) {
  const windowStart = Math.max(minEnd, target - Math.floor((target - minEnd) * 0.4));

  // Prefer paragraph boundaries. They preserve the document's natural structure.
  const paragraph = text.lastIndexOf('\n\n', target);
  if (paragraph >= windowStart) {
    return paragraph + 2;
  }

  // Then prefer sentence boundaries. Keep the punctuation with the sentence.
  for (let i = target - 1; i >= windowStart; i -= 1) {
    const char = text[i];
    const next = text[i + 1];
    if ((char === '.' || char === '?' || char === '!' || char === ';') && /\s/.test(next || '')) {
      return i + 1;
    }
  }

  // Finally fall back to a word boundary.
  const space = text.lastIndexOf(' ', target);
  if (space >= minEnd) {
    return space;
  }

  return target;
}

function alignStart(text, start, previousEnd) {
  if (start <= 0 || start >= previousEnd || /\s/.test(text[start])) {
    return start;
  }

  // Never begin a fragment in the middle of a word. Moving backward keeps
  // the requested overlap approximately intact while preserving whole words.
  const boundary = text.lastIndexOf(' ', start);
  return boundary >= 0 ? boundary + 1 : start;
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
      end = findBoundary(normalized, end, start + Math.floor(size * 0.6));
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

    const requestedStart = Math.max(end - overlap, start + 1);
    start = alignStart(normalized, requestedStart, end);

    // Safety guard: if alignment cannot advance, move to the next character.
    if (start <= chunks.at(-1)?.startOffset) {
      start = Math.min(end, requestedStart + 1);
    }
  }

  return chunks;
}
