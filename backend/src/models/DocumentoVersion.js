import { defineModel, DataTypes } from './_factory.js';

export function initDocumentoVersion(sequelize) {
  return defineModel(sequelize, 'DocumentoVersion', 'documento_versiones', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    documento_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    version: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    texto_extraido: { type: DataTypes.TEXT('medium'), allowNull: true },
    hash_contenido: { type: DataTypes.STRING(255), allowNull: true },
    ubicacion: { type: DataTypes.STRING(1000), allowNull: true },
    tamano_bytes: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  });
}
