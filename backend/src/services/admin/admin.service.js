import { Op, fn, col } from 'sequelize';

export async function getRagOverview(db) {
  const [
    totalDocuments,
    publishedDocuments,
    draftDocuments,
    inactiveDocuments,
    crmDocuments,
    driveDocuments,
    versions,
    fragments,
    sourcesUsed,
    veraMessages,
    veraSupportCases,
    latestDocument,
  ] = await Promise.all([
    db.Documento.count({ where: { origen: { [Op.in]: ['CRM_ADMIN', 'GOOGLE_DRIVE'] } } }),
    db.Documento.count({ where: { origen: 'CRM_ADMIN', estado: 'PUBLICADO' } }),
    db.Documento.count({ where: { origen: 'CRM_ADMIN', estado: 'BORRADOR' } }),
    db.Documento.count({ where: { origen: { [Op.in]: ['CRM_ADMIN', 'GOOGLE_DRIVE'] }, estado: 'INACTIVO' } }),
    db.Documento.count({ where: { origen: 'CRM_ADMIN' } }),
    db.Documento.count({ where: { origen: 'GOOGLE_DRIVE' } }),
    db.DocumentoVersion.count(),
    db.Fragmento.count(),
    db.FuenteMensaje.count(),
    db.Mensaje.count({ where: { rol: 'VERA' } }),
    db.CasoSoporte.count({ where: { origen: 'VERA' } }),
    db.Documento.findOne({ where: { origen: { [Op.in]: ['CRM_ADMIN', 'GOOGLE_DRIVE'] } }, attributes: ['updatedAt'], order: [['updated_at', 'DESC']] }),
  ]);

  return {
    documents: {
      total: totalDocuments,
      published: publishedDocuments,
      draft: draftDocuments,
      inactive: inactiveDocuments,
      crm: crmDocuments,
      drive: driveDocuments,
      latest: latestDocument?.updatedAt || null,
    },
    versions,
    fragments,
    sourcesUsed,
    veraMessages,
    support: { veraCases: veraSupportCases },
    ingestion: { maxFileSizeMb: 10, allowedTypes: ['PDF', 'DOCX', 'TXT', 'MD', 'JSON'] },
  };
}

export async function getAdminDashboard(db) {
  const [users, openCases, docs, events] = await Promise.all([
    db.Usuario.count({ where: { estado: { [Op.ne]: 'ELIMINADO' } } }),
    db.CasoSoporte.count({ where: { estado: { [Op.in]: ['NUEVO', 'EN_PROGRESO', 'ESPERANDO_USUARIO'] } } }),
    db.Documento.count({ where: { origen: 'CRM_ADMIN', estado: 'PUBLICADO' } }),
    db.Evento.count({ where: { tipo: { [Op.like]: 'VERA_%' } } }),
  ]);
  return { users, openCases, publishedKnowledge: docs, veraEvents: events };
}

export async function listUsers(db, { search = '', limit = 50, offset = 0 } = {}) {
  const where = search.trim()
    ? { [Op.or]: [
        { email: { [Op.like]: `%${search.trim()}%` } },
        { nombre: { [Op.like]: `%${search.trim()}%` } },
        { apellido: { [Op.like]: `%${search.trim()}%` } },
      ] }
    : {};
  const { rows, count } = await db.Usuario.findAndCountAll({
    where,
    attributes: ['id', 'email', 'nombre', 'apellido', 'rol', 'estado', 'createdAt', 'updatedAt'],
    order: [['id', 'DESC']],
    limit: Math.min(Number(limit) || 50, 100),
    offset: Math.max(Number(offset) || 0, 0),
  });
  return { users: rows, total: count };
}

export async function listKnowledge(db) {
  const documents = await db.Documento.findAll({
    where: { origen: 'CRM_ADMIN' },
    attributes: ['id', 'nombre', 'descripcion', 'tipo', 'mime_type', 'estado', 'publicado_at', 'createdAt', 'updatedAt'],
    include: [{ model: db.DocumentoVersion, attributes: ['id', 'version', 'tamano_bytes', 'createdAt'], separate: true, order: [['version', 'DESC']], limit: 1 }],
    order: [['updated_at', 'DESC']],
  });
  const versionIds = documents.flatMap((doc) => {
    const json = doc.toJSON();
    return (json.DocumentoVersions || []).map((version) => version.id);
  });
  const fragmentRows = versionIds.length
    ? await db.Fragmento.findAll({ attributes: ['documento_version_id', [fn('COUNT', col('id')), 'count']], where: { documento_version_id: { [Op.in]: versionIds } }, group: ['documento_version_id'], raw: true })
    : [];
  const fragmentCounts = new Map(fragmentRows.map((row) => [String(row.documento_version_id), Number(row.count)]));
  return documents.map((doc) => {
    const json = doc.toJSON();
    const latestVersion = json.DocumentoVersions?.[0] || null;
    return {
      ...json,
      latestVersion: latestVersion ? latestVersion.version : null,
      latestSizeBytes: latestVersion ? latestVersion.tamano_bytes : null,
      fragmentCount: latestVersion ? (fragmentCounts.get(String(latestVersion.id)) || 0) : 0,
    };
  });
}

export async function listSupportCases(db, { status } = {}) {
  const where = status ? { estado: status } : {};
  return db.CasoSoporte.findAll({
    where,
    include: [
      { model: db.Usuario, as: 'usuario', attributes: ['id', 'email', 'nombre', 'apellido'] },
      { model: db.Usuario, as: 'asignadoA', attributes: ['id', 'nombre', 'apellido'] },
    ],
    order: [['updated_at', 'DESC']],
    limit: 100,
  });
}

export async function getSupportCase(db, id) {
  return db.CasoSoporte.findByPk(id, {
    include: [
      { model: db.Usuario, as: 'usuario', attributes: ['id', 'email', 'nombre', 'apellido'] },
      { model: db.Usuario, as: 'asignadoA', attributes: ['id', 'nombre', 'apellido'] },
      { model: db.MensajeSoporte, include: [{ model: db.Usuario, as: 'autor', attributes: ['id', 'nombre', 'apellido', 'rol'] }], order: [['created_at', 'ASC']] },
    ],
  });
}

export async function createSupportCase(db, { userId, asunto, mensaje, origen = 'USUARIO' }) {
  const caso = await db.CasoSoporte.create({ usuario_id: userId, asunto, mensaje_inicial: mensaje, origen });
  await db.MensajeSoporte.create({ caso_soporte_id: caso.id, autor_tipo: 'USUARIO', autor_usuario_id: userId, contenido: mensaje });
  return caso;
}

export async function addSupportMessage(db, { caseId, authorId, authorType, content }) {
  const caso = await db.CasoSoporte.findByPk(caseId);
  if (!caso) throw Object.assign(new Error('Caso de soporte no encontrado.'), { status: 404 });
  await db.MensajeSoporte.create({ caso_soporte_id: caseId, autor_tipo: authorType, autor_usuario_id: authorId || null, contenido: content });
  const nextStatus = authorType === 'ADMIN' ? 'ESPERANDO_USUARIO' : 'EN_PROGRESO';
  await caso.update({ estado: nextStatus });
  return caso;
}

export async function updateSupportCase(db, { id, status, priority, adminId }) {
  const caso = await db.CasoSoporte.findByPk(id);
  if (!caso) throw Object.assign(new Error('Caso de soporte no encontrado.'), { status: 404 });
  const patch = {};
  if (status) patch.estado = status;
  if (priority) patch.prioridad = priority;
  if (adminId) patch.asignado_a_usuario_id = adminId;
  if (status === 'RESUELTO' || status === 'CERRADO') patch.resuelto_at = new Date();
  await caso.update(patch);
  return caso;
}
