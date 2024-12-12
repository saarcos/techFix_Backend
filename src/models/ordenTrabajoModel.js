import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import ImagenOrden from './imagenOrden.js';
import Equipo from './equipoModel.js'
import Usuario from './userModel.js'
import DetalleOrden from './detalleOrdenModel.js';
import AccesoriosDeOrden from './accesorioOrdenModel.js';

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
  cliente_id: {  // Cambiado de id_cliente a cliente_id
    type: DataTypes.INTEGER,
    allowNull: false, // Mantener el campo pero sin relación directa
  },
  numero_orden: {
    type: DataTypes.STRING(50),
    allowNull: true, // Permitir null para que el trigger lo genere
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
OrdenTrabajo.hasMany(DetalleOrden, {
  foreignKey: 'id_orden',
  as: 'detalles'
});
OrdenTrabajo.hasMany(AccesoriosDeOrden,{foreignKey: 'id_orden', as:'accesorios'})


export default OrdenTrabajo;
