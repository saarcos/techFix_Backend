// models/existenciasModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Almacen from './almacenModel.js';
import Producto from './productModel.js';

const Existencias = sequelize.define('existencias', {
  id_existencias: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_almacen: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Almacen,
      key: 'id_almacen',
    },
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id_producto',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'existencias',
  timestamps: false,
});

Existencias.belongsTo(Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
Existencias.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

export default Existencias;
