import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Cliente from './clientModel.js';
import TipoEquipo from './tipoEquipoModel.js';
import Marca from './brandModel.js';
import Modelo from './modelModel.js';

const Equipo = sequelize.define('Equipo', {
  id_equipo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_equipo'
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_cliente',
    references: {
      model: Cliente,
      key: 'id_cliente'
    }
  },
  id_tipoe: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_tipoe',
    references: {
      model: TipoEquipo,
      key: 'id_tipoe'
    }
  },
  id_marca: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_marca',
    references: {
      model: Marca,
      key: 'id_marca'
    }
  },
  id_modelo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_modelo',
    references: {
      model: Modelo,
      key: 'id_modelo'
    }
  },
  nserie: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'nserie'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  }
}, {
  tableName: 'equipo',
  timestamps: false,
});

Cliente.hasMany(Equipo, { foreignKey: 'id_cliente' });
Equipo.belongsTo(Cliente, { foreignKey: 'id_cliente', as:'cliente'});

TipoEquipo.hasMany(Equipo, { foreignKey: 'id_tipoe' });
Equipo.belongsTo(TipoEquipo, { foreignKey: 'id_tipoe', as:'tipoEquipo' });

Marca.hasMany(Equipo, { foreignKey: 'id_marca' });
Equipo.belongsTo(Marca, { foreignKey: 'id_marca', as:'marca' });

Modelo.hasMany(Equipo, { foreignKey: 'id_modelo' });
Equipo.belongsTo(Modelo, { foreignKey: 'id_modelo', as:'modelo' });

export default Equipo;
