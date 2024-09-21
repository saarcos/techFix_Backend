import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Producto from './productModel.js';

const ProductoOrden = sequelize.define('productosorden', {
    id_prodorde: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_prodorde',
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_producto',
    },
    id_orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_orden',
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cantidad',
    }
}, {
    tableName: 'productosorden',
    timestamps: false,
});
// Relación entre ProductoOrden y Producto
ProductoOrden.belongsTo(Producto, {
    foreignKey: 'id_producto',
    as: 'producto', // Esto permite incluir el producto relacionado en las consultas
});

export default ProductoOrden;
