// models/detalleOrdenModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Usuario from './userModel.js';
import Producto from './productModel.js';
import Servicio from './serviceModel.js';

const DetalleOrden = sequelize.define('detalleorden', {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id_usuario',
    },
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Servicio,
      key: 'id_servicio',
    },
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Producto,
      key: 'id_producto',
    },
  },
  precioservicio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  precioproducto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  preciototal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'detalleorden',
  timestamps: false,
});

DetalleOrden.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
DetalleOrden.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
DetalleOrden.belongsTo(Servicio, { foreignKey: 'id_servicio', as: 'servicio' });

export default DetalleOrden;
