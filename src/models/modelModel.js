import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Marca from './brandModel.js';

const Modelo = sequelize.define('Modelo', {
  id_modelo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_modelo'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombre'
  },
  id_marca: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_marca',
    references: {
      model: Marca,
      key: 'id_marca'
    }
  }
}, {
  tableName: 'modelo',
  timestamps: false,
});

Marca.hasMany(Modelo, { foreignKey: 'id_marca' });
Modelo.belongsTo(Marca, { foreignKey: 'id_marca' });

export default Modelo;
