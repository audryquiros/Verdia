import { defineModel, DataTypes } from './_factory.js';

export function initEvento(sequelize) {
  return defineModel(sequelize, 'Evento', 'eventos', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    tipo: { type: DataTypes.STRING(255), allowNull: false },
    entidad: { type: DataTypes.STRING(255), allowNull: true },
    entidad_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    payload: { type: DataTypes.JSON, allowNull: true },
    estado: { type: DataTypes.STRING(255), allowNull: false },
    procesado_at: { type: DataTypes.DATE, allowNull: true },
  });
}
