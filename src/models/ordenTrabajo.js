// models/OrdenTrabajo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import ImagenOrden from './imagenOrden.js';
import Equipo from './equipoModel.js'
import Usuario from './userModel.js'
import Cliente from './clientModel.js'
const OrdenTrabajo = sequelize.define('ordentrabajo', {
  id_orden: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser null
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numero_orden: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  area: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'entrada',
  },
  prioridad: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  fecha_prometida: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  presupuesto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  adelanto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  confirmacion: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  passwordequipo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'ordentrabajo',
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['numero_orden'] }, // Excluir numero_orden por defecto
  },
  scopes: {
    withNumeroOrden: { attributes: {} }, // Scope para incluir todos los atributos, incluido numero_orden
  }
});
OrdenTrabajo.hasMany(ImagenOrden, {
    foreignKey: 'id_orden',
    as: 'imagenes',
  });
  
ImagenOrden.belongsTo(OrdenTrabajo, {
    foreignKey: 'id_orden',
    as: 'orden',
});
OrdenTrabajo.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' });
OrdenTrabajo.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
OrdenTrabajo.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

export default OrdenTrabajo;
