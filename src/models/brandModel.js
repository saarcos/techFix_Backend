import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Marca = sequelize.define('Marca', {
  id_marca: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_marca'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombre'
  }
}, {
  tableName: 'marca',
  timestamps: false,
});

export default Marca;
