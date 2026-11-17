export async function retrieveFragments({ Fragmento, query, limit = 5, spaceId }) {
  if (!Fragmento) {
    throw new Error('Fragmento model is required');
  }

  const replacements = {
    query: query.trim(),
    spaceId,
    limit,
  };

  const sql = `
    SELECT
      f.id,
      f.documento_version_id AS documentoVersionId,
      f.contenido AS content,
      f.indice AS fragmentIndex
    FROM fragmentos f
    INNER JOIN documento_versiones dv
      ON dv.id = f.documento_version_id
    INNER JOIN documentos d
      ON d.id = dv.documento_id
    WHERE d.espacio_financiero_id = :spaceId
      AND MATCH(f.contenido) AGAINST (:query IN NATURAL LANGUAGE MODE)
    ORDER BY MATCH(f.contenido) AGAINST (:query IN NATURAL LANGUAGE MODE) DESC
    LIMIT :limit
  `;

  const [rows] = await Fragmento.sequelize.query(sql, { replacements });
  return rows;
}
