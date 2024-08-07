import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Cliente = sequelize.define('cliente', {
    id_cliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id_cliente',
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombre',
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'apellido',
    },
    cedula: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
        field: 'cedula',
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'correo',
    },
    celular: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        field: 'celular',
    },
    tipo_cliente: {
      type: DataTypes.ENUM('Persona', 'Empresa'),
      allowNull: false,
      defaultValue: 'Persona',
      field: 'tipo_cliente'
    }
  }, {
    tableName: 'cliente',
    timestamps: false,
  });
export default Cliente;