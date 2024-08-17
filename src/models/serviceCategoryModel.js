// models/serviceCategoryModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const CategoriaServicio = sequelize.define('categoriaServicio', {
  id_catserv: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_catserv',
  },
  nombreCat: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombrecat',
  },
}, {
  tableName: 'categoriaservicio',
  timestamps: false,
});

export default CategoriaServicio;
