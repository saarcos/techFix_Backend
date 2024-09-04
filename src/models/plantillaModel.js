// models/plantillaModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import GrupoTareas from './grupoTareasModel.js';

const Plantilla = sequelize.define('plantilla', {
  id_grupo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_grupo',
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion',
  },
}, {
  tableName: 'plantilla',
  timestamps: false,
});

// Relación con GrupoTareas
Plantilla.hasMany(GrupoTareas, { foreignKey: 'id_grupo', as: 'tareas' });

export default Plantilla;
