import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Servicio from './serviceModel.js';
const ServicioOrden = sequelize.define('serviciosorden', {
    id_servorden: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_servorden',
    },
    id_servicio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_servicio',
    },
    id_orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_orden',
    }
}, {
    tableName: 'serviciosorden',
    timestamps: false,
});
ServicioOrden.belongsTo(Servicio, { foreignKey: 'id_servicio', as: 'servicio' });

export default ServicioOrden;
