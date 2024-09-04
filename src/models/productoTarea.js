// models/productoTareaModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Producto from './productModel.js';
import Tarea from './tareaModel.js';

const ProductoTarea = sequelize.define('productoTarea', {
  id_taskprod: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_taskprod',
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_producto',
  },
  id_tarea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tarea',
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cantidad',
  },
}, {
  tableName: 'productostarea',
  timestamps: false,
});

ProductoTarea.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

export default ProductoTarea;
