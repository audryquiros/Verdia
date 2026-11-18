import { defineModel, DataTypes } from './_factory.js';

export function initDocumento(sequelize) {
  return defineModel(sequelize, 'Documento', 'documentos', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    organizacion_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    espacio_financiero_id: { type: DataTypes.BIGINT, allowNull: true },
    fuente_externa_id: { type: DataTypes.STRING(255), allowNull: true },
    fuente_externa_modificada_at: { type: DataTypes.DATE, allowNull: true },
    tipo: { type: DataTypes.STRING(255), allowNull: false },
    origen: { type: DataTypes.STRING(255), allowNull: false },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    ruta_url: { type: DataTypes.STRING(1000), allowNull: true },
    mime_type: { type: DataTypes.STRING(255), allowNull: true },
    fecha_documento: { type: DataTypes.DATE, allowNull: true },
    estado: { type: DataTypes.STRING(255), allowNull: false },
  });
}
