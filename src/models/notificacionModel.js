import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Notificacion = sequelize.define('notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_referencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  leida: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'notificacion',
  timestamps: false, // Si no necesitas `createdAt` y `updatedAt`
});

export default Notificacion;
