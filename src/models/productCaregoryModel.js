// models/productCategory.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const CategoriaProducto = sequelize.define('categoriaproducto', {
  id_catprod: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_catprod',
  },
  nombreCat: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombrecat',
  },
}, {
  tableName: 'categoriaproducto',
  timestamps: false,
});

export default CategoriaProducto;
