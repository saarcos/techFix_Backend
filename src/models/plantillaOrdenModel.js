// models/plantillaOrdenModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js'; // Archivo de configuración

const PlantillaOrden = sequelize.define('plantillaorden', {
  id_plantillaorden: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ordentrabajo',  // Nombre de la tabla de órdenes
      key: 'id_orden',
    },
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'plantilla',  // Nombre de la tabla de plantillas
      key: 'id_grupo',
    },
  },
}, {
  tableName: 'plantillaorden',
  timestamps: false,  // Si no utilizas createdAt/updatedAt
});

export default PlantillaOrden;
