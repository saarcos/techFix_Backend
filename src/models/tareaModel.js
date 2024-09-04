// models/tareaModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import ProductoTarea from './productoTarea.js';
import ServicioTarea from './servicioTarea.js';
const Tarea = sequelize.define('tarea', {
  id_tarea: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_tarea',
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'titulo',
  },
  tiempo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'tiempo',
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion',
  },
}, {
  tableName: 'tarea',
  timestamps: false,
});
// Definir las asociaciones
Tarea.hasMany(ProductoTarea, { foreignKey: 'id_tarea', as: 'productos' });
Tarea.hasMany(ServicioTarea, { foreignKey: 'id_tarea', as: 'servicios' });

export default Tarea;
