import { defineModel, DataTypes } from './_factory.js';

export function initConversacion(sequelize) {
  return defineModel(sequelize, 'Conversacion', 'conversaciones', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    titulo: { type: DataTypes.STRING(255), allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA','CERRADA'), allowNull: false },
  });
}
