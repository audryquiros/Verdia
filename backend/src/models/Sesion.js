import { defineModel, DataTypes } from './_factory.js';

export function initSesion(sequelize) {
  return defineModel(sequelize, 'Sesion', 'sesiones', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    token_hash: { type: DataTypes.STRING(255), allowNull: false },
    ip: { type: DataTypes.STRING(255), allowNull: true },
    user_agent: { type: DataTypes.STRING(255), allowNull: true },
    expira_at: { type: DataTypes.DATE, allowNull: false },
    revocada_at: { type: DataTypes.DATE, allowNull: true },
  });
}
