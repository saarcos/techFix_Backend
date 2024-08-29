// models/ImagenOrden.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const ImagenOrden = sequelize.define('imagenorden', {
  id_imagen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url_imagen: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'imagenorden',
  timestamps: false,
});

export default ImagenOrden;
