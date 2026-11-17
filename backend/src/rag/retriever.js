export async function retrieveFragments({ Fragmento, query, limit = 5, spaceId }) {
  if (!Fragmento) throw new Error('Fragmento model is required');

  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
  const normalizedQuery = query.trim();
  const replacements = {
    query: normalizedQuery,
    spaceId,
    limit: safeLimit,
  };

  const fullTextSql = `
    SELECT
      f.id,
      f.documento_version_id AS documentoVersionId,
      f.contenido AS content,
      f.indice AS fragmentIndex,
      d.nombre AS title,
      d.ruta_url AS uri,
      MATCH(f.contenido) AGAINST (:query IN NATURAL LANGUAGE MODE) AS score
    FROM fragmentos f
    INNER JOIN documento_versiones dv ON dv.id = f.documento_version_id
    INNER JOIN documentos d ON d.id = dv.documento_id
    INNER JOIN (
      SELECT documento_id, MAX(version) AS version
      FROM documento_versiones
      GROUP BY documento_id
    ) latest ON latest.documento_id = dv.documento_id AND latest.version = dv.version
    WHERE d.espacio_financiero_id = :spaceId
      AND d.estado = 'ACTIVO'
      AND MATCH(f.contenido) AGAINST (:query IN NATURAL LANGUAGE MODE)
    ORDER BY score DESC, f.id DESC
    LIMIT :limit
  `;

  const [rows] = await Fragmento.sequelize.query(fullTextSql, { replacements });
  if (rows.length) return rows;

  // Fallback útil para consultas cortas o términos que MySQL considera stopwords.
  const tokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}_-]/gu, ''))
    .filter((token) => token.length >= 3)
    .slice(0, 5);

  if (!tokens.length) return [];

  const likeConditions = tokens.map((_, index) => `f.contenido LIKE :token${index}`).join(' OR ');
  const likeReplacements = { spaceId, limit: safeLimit };
  tokens.forEach((token, index) => {
    likeReplacements[`token${index}`] = `%${token}%`;
  });

  const fallbackSql = `
    SELECT
      f.id,
      f.documento_version_id AS documentoVersionId,
      f.contenido AS content,
      f.indice AS fragmentIndex,
      d.nombre AS title,
      d.ruta_url AS uri
    FROM fragmentos f
    INNER JOIN documento_versiones dv ON dv.id = f.documento_version_id
    INNER JOIN documentos d ON d.id = dv.documento_id
    INNER JOIN (
      SELECT documento_id, MAX(version) AS version
      FROM documento_versiones
      GROUP BY documento_id
    ) latest ON latest.documento_id = dv.documento_id AND latest.version = dv.version
    WHERE d.espacio_financiero_id = :spaceId
      AND d.estado = 'ACTIVO'
      AND (${likeConditions})
    ORDER BY f.id DESC
    LIMIT :limit
  `;

  const [fallbackRows] = await Fragmento.sequelize.query(fallbackSql, {
    replacements: likeReplacements,
  });
  return fallbackRows;
}
