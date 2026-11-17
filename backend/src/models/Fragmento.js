import { defineModel, DataTypes } from './_factory.js';

export function initFragmento(sequelize) {
  return defineModel(sequelize, 'Fragmento', 'fragmentos', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    documento_version_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    indice: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    contenido: { type: DataTypes.TEXT('medium'), allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true },
  });
}
