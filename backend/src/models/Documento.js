import { defineModel, DataTypes } from './_factory.js';

export function initDocumento(sequelize) {
  return defineModel(sequelize, 'Documento', 'documentos', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    organizacion_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    tipo: { type: DataTypes.STRING(255), allowNull: false },
    origen: { type: DataTypes.STRING(255), allowNull: false },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    ruta_url: { type: DataTypes.STRING(255), allowNull: true },
    mime_type: { type: DataTypes.STRING(255), allowNull: true },
    fecha_documento: { type: DataTypes.DATE, allowNull: true },
    estado: { type: DataTypes.STRING(255), allowNull: false },
  });
}
