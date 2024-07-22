// models/usuario.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Usuario = sequelize.define('usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_usuario',
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_rol',
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombre',
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'apellido',
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'email',
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'password_hash',
  },
}, {
  tableName: 'usuario',
  timestamps: false,
});

export default Usuario;
