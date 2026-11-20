import { defineModel, DataTypes } from './_factory.js';

export function initMensajeSoporte(sequelize) {
  return defineModel(sequelize, 'MensajeSoporte', 'mensajes_soporte', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    caso_soporte_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    autor_tipo: { type: DataTypes.ENUM('USUARIO','ADMIN','SISTEMA'), allowNull: false },
    autor_usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    contenido: { type: DataTypes.TEXT, allowNull: false },
  });
}
