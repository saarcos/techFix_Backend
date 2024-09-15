import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js'; // Asumiendo que ya tienes configurado el archivo de conexión

const Accesorio = sequelize.define('accesorio', {
  id_accesorio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'accesorio',
  timestamps: false,  // Si no usas createdAt/updatedAt
});

export default Accesorio;
