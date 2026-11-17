async function extractDocxWithMammoth(buffer) {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.default.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
}

async function extractPdfWithUnpdf(buffer) {
  try {
    const unpdf = await import('unpdf');
    const pdf = await unpdf.getDocumentProxy(new Uint8Array(buffer));
    const result = await unpdf.extractText(pdf, { mergePages: true });
    return result.text;
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

export async function extractText({ buffer, mimeType, fileName = '' }) {
  if (!Buffer.isBuffer(buffer)) throw new Error('A file buffer is required');

  if (mimeType?.startsWith('text/') ||
      ['application/json', 'application/xml', 'application/javascript'].includes(mimeType)) {
    return buffer.toString('utf8');
  }

  if (DOCX_MIME_TYPES.has(mimeType) || fileName.toLowerCase().endsWith('.docx')) {
    return extractDocxWithMammoth(buffer);
  }

  if (PDF_MIME_TYPES.has(mimeType) || fileName.toLowerCase().endsWith('.pdf')) {
    return extractPdfWithUnpdf(buffer);
  }

  throw new Error(`Unsupported file type for text extraction: ${mimeType || fileName}`);
}
