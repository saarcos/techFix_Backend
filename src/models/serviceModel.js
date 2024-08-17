// models/Servicio.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import CategoriaServicio from './serviceCategoryModel.js';

const Servicio = sequelize.define('servicio', {
  id_servicio: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_servicio',
  },
  id_catserv: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_catserv',
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombre',
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio',
  },
}, {
  tableName: 'servicio',
  timestamps: false,
});

Servicio.belongsTo(CategoriaServicio, { foreignKey: 'id_catserv', as: 'categoriaServicio' });

export default Servicio;
