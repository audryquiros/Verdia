import { defineModel, DataTypes } from './_factory.js';

export function initUsuario(sequelize) {
  return defineModel(sequelize, 'Usuario', 'usuarios', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: true },
    nombre: { type: DataTypes.STRING(255), allowNull: true },
    apellido: { type: DataTypes.STRING(255), allowNull: true },
    foto_url: { type: DataTypes.STRING(255), allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVO','BLOQUEADO','ELIMINADO'), allowNull: false },
    email_verificado_at: { type: DataTypes.DATE, allowNull: true },
  });
}
