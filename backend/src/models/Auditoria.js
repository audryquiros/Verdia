import { defineModel, DataTypes } from './_factory.js';

export function initAuditoria(sequelize) {
  return defineModel(sequelize, 'Auditoria', 'auditoria', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    accion: { type: DataTypes.STRING(255), allowNull: false },
    entidad: { type: DataTypes.STRING(255), allowNull: true },
    entidad_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    detalle: { type: DataTypes.JSON, allowNull: true },
    ip: { type: DataTypes.STRING(255), allowNull: true },
    resultado: { type: DataTypes.STRING(255), allowNull: true },
    metadatos: { type: DataTypes.JSON, allowNull: true },
  });
}
