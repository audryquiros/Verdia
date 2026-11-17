import { defineModel, DataTypes } from './_factory.js';

export function initMembresia(sequelize) {
  return defineModel(sequelize, 'Membresia', 'membresias', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    organizacion_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    rol_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    estado: { type: DataTypes.STRING(255), allowNull: false },
  });
}
