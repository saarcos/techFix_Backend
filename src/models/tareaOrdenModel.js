// models/TareaOrden.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Tarea from './tareaModel.js';
import Usuario from './userModel.js';

const TareaOrden = sequelize.define('tareaOrden', {
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
    references: {
      model: Tarea,
      key: 'id_tarea'
    }
  },
  id_orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_orden',
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true, // Ahora es opcional
    field: 'id_usuario',
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'status',
  }
}, {
  tableName: 'tareaorden',
  timestamps: false,
});

TareaOrden.belongsTo(Tarea, { foreignKey: 'id_tarea', as: 'tarea' });
TareaOrden.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

export default TareaOrden;
