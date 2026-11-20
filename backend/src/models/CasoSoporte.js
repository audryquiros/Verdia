import { defineModel, DataTypes } from './_factory.js';

export function initCasoSoporte(sequelize) {
  return defineModel(sequelize, 'CasoSoporte', 'casos_soporte', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    asignado_a_usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    asunto: { type: DataTypes.STRING(180), allowNull: false },
    estado: { type: DataTypes.ENUM('NUEVO','EN_PROGRESO','ESPERANDO_USUARIO','RESUELTO','CERRADO'), allowNull: false, defaultValue: 'NUEVO' },
    prioridad: { type: DataTypes.ENUM('BAJA','NORMAL','ALTA','URGENTE'), allowNull: false, defaultValue: 'NORMAL' },
    origen: { type: DataTypes.ENUM('USUARIO','VERA','SISTEMA'), allowNull: false, defaultValue: 'USUARIO' },
    mensaje_inicial: { type: DataTypes.TEXT, allowNull: false },
    resuelto_at: { type: DataTypes.DATE, allowNull: true },
  });
}
