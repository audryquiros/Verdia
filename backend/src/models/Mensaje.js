import { defineModel, DataTypes } from './_factory.js';

export function initMensaje(sequelize) {
  return defineModel(sequelize, 'Mensaje', 'mensajes', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    conversacion_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    rol: { type: DataTypes.ENUM('USUARIO','VERA','SISTEMA'), allowNull: false },
    contenido: { type: DataTypes.TEXT('medium'), allowNull: false },
    tokens: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  });
}
