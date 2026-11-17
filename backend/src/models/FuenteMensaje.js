import { defineModel, DataTypes } from './_factory.js';

export function initFuenteMensaje(sequelize) {
  return defineModel(sequelize, 'FuenteMensaje', 'fuentes_mensaje', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    mensaje_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    documento_version_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    tipo: { type: DataTypes.STRING(255), allowNull: false },
    referencia: { type: DataTypes.STRING(255), allowNull: true },
    confianza: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    metadatos: { type: DataTypes.JSON, allowNull: true },
  });
}
