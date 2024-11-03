// models/almacenModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Almacen = sequelize.define('almacen', {
  id_almacen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'almacen',
  timestamps: false,
});

export default Almacen;
