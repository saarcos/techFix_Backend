// models/productModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import CategoriaProducto from './productCaregoryModel.js';

const Producto = sequelize.define('producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_producto',
  },
  id_catprod: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_catprod',
  },
  nombreProducto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombreproducto',
  },
  codigoProducto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'codigoproducto',
  },
  precioSinIVA: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'preciosiniva',
  },
  precioFinal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'preciofinal',
  },
  iva: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 12,  // IVA por defecto del 12%
    field: 'iva',
  },
}, {
  tableName: 'producto',
  timestamps: false,
});

Producto.belongsTo(CategoriaProducto, { foreignKey: 'id_catprod', as: 'categoriaProducto' });

export default Producto;
