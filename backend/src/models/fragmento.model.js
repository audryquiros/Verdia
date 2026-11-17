import { DataTypes, Model } from 'sequelize';

export default class Fragmento extends Model {
  static initModel(sequelize) {
    Fragmento.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        documento_version_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
        },
        indice: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        contenido: {
          type: DataTypes.TEXT('medium'),
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Fragmento',
        tableName: 'fragmentos',
        timestamps: true,
        underscored: true,
      }
    );
    return Fragmento;
  }
}
