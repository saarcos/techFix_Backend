// models/grupoTareasModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Tarea from './tareaModel.js';

const GrupoTareas = sequelize.define('grupoTareas', {
  id_taskgroup: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_taskgroup',
  },
  id_tarea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tarea',
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_grupo',
  },
}, {
  tableName: 'grupotareas',
  timestamps: false,
});

// Relación con Tarea
GrupoTareas.belongsTo(Tarea, { foreignKey: 'id_tarea', as: 'tarea' });



export default GrupoTareas;
