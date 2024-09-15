import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import OrdenTrabajo from './ordenTrabajo.js';  // Asumiendo que ya tienes el modelo de orden
import Accesorio from './accesorioModel.js';  // Modelo de accesorio definido arriba

const AccesoriosDeOrden = sequelize.define('accesoriosdeorden', {
  id_accesorioord: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: OrdenTrabajo,
      key: 'id_orden'
    }
  },
  id_accesorio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Accesorio,
      key: 'id_accesorio'
    }
  },
}, {
  tableName: 'accesoriosdeorden',
  timestamps: false,
});

export default AccesoriosDeOrden;
