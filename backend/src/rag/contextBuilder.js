export function buildContext(results = []) {
  return results
    .map((item, index) => {
      const source = item.sourceName || item.documentName || item.title || `Fuente ${index + 1}`;
      const page = item.pageNumber ? `, página ${item.pageNumber}` : '';
      return [
        `[FUENTE ${index + 1}] ${source}${page}`,
        item.content,
      ].join('\n');
    })
    .join('\n\n');
}
