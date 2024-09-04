// models/servicioTareaModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Servicio from './serviceModel.js';
import Tarea from './tareaModel.js';

const ServicioTarea = sequelize.define('servicioTarea', {
  id_taskserv: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_taskserv',
  },
  id_tarea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tarea',
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_servicio',
  },
}, {
  tableName: 'serviciostarea',
  timestamps: false,
});

ServicioTarea.belongsTo(Servicio, { foreignKey: 'id_servicio', as: 'servicio' });

export default ServicioTarea;
