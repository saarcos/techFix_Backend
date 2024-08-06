import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const TipoEquipo = sequelize.define('TipoEquipo', {
  id_tipoe: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_tipoe'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombre'
  }
}, {
  tableName: 'tipoequipo',
  timestamps: false,
});

export default TipoEquipo;
