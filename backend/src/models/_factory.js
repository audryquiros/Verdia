import { Model, DataTypes } from 'sequelize';

export function defineModel(sequelize, modelName, tableName, attributes, options = {}) {
  class Entity extends Model {}

  Entity.init(attributes, {
    sequelize,
    modelName,
    tableName,
    timestamps: true,
    underscored: true,
    ...options,
  });

  return Entity;
}

export { DataTypes };
