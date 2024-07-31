import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Rol = sequelize.define('rol', {
    id_rol: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id_rol',
    },
    nombrerol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombrerol',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'descripcion',
    }
  }, {
    tableName: 'rol',
    timestamps: false,
  });
  
  export default Rol;