// models/tareasOrdenModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Tarea from './tareaModel.js';
import Orden from './ordenTrabajo.js';
import Usuario from './userModel.js';

const TareasOrden = sequelize.define('tareasOrden', {
  id_taskord: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'id_taskord',
  },
  id_tarea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tarea',
  },
  id_orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_orden',
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario',
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'status',
  }
}, {
  tableName: 'tareasorden',
  timestamps: false,
});

// Relaciones
TareasOrden.belongsTo(Tarea, { foreignKey: 'id_tarea', as: 'tarea' });
TareasOrden.belongsTo(Orden, { foreignKey: 'id_orden', as: 'orden' });
TareasOrden.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

export default TareasOrden;
