import { defineModel, DataTypes } from './_factory.js';

export function initPoliticaVersion(sequelize) {
  return defineModel(sequelize, 'PoliticaVersion', 'politica_versiones', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    politica_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    documento_version_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    version: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    contenido: { type: DataTypes.TEXT('medium'), allowNull: true },
    fecha_vigencia: { type: DataTypes.DATE, allowNull: true },
    estado: { type: DataTypes.STRING(255), allowNull: false },
  });
}
