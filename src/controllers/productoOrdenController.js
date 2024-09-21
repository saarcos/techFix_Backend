import { z } from 'zod';
import ProductoOrden from '../models/productOrdenModel.js';
import Producto from '../models/productModel.js';


const productSchema = z.object({
    id_producto: z.number().int().positive('El id del producto debe ser un número positivo').nonnegative(),
    cantidad: z.number().int().positive('La cantidad debe ser un número positivo').nonnegative(),
});

const productoOrdenSchema = z.object({
    id_orden: z.number().int().positive('El id de la orden debe ser un número positivo'),
    productos: z.array(productSchema) // Validamos que sea un array de productos
});

// Crear varios productos en la Orden y reducir el stock
export const addProductsToOrder = async (req, res) => {
    const result = productoOrdenSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { id_orden, productos } = result.data;

    try {
        const productsToAdd = [];

        for (const { id_producto, cantidad } of productos) {
            const product = await Producto.findByPk(id_producto);

            // Verificamos que el producto exista y tenga stock suficiente
            if (!product) {
                return res.status(404).json({ error: `Producto con id ${id_producto} no encontrado` });
            }

            if (product.stock < cantidad) {
                return res.status(400).json({ error: `Stock insuficiente para el producto con id ${id_producto}` });
            }

            // Reducimos el stock del producto
            product.stock -= cantidad;
            await product.save();

            // Añadimos el producto a la orden
            productsToAdd.push({
                id_producto,
                id_orden,
                cantidad,
            });
        }

        // Insertamos los productos en la tabla de productos de la orden
        const newProductOrders = await ProductoOrden.bulkCreate(productsToAdd);
        res.status(201).json(newProductOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los productos de una orden
export const getProductsFromOrder = async (req, res) => {
    const { id_orden } = req.params;
    try {
        const products = await ProductoOrden.findAll({ where: { id_orden } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar productos en una orden y ajustar el stock
export const updateProductInOrder = async (req, res) => {
    const { id } = req.params;
    const result = productoOrdenSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { id_producto, cantidad } = result.data.productos[0]; // Asumimos que se está actualizando un solo producto
    try {
        const productOrder = await ProductoOrden.findByPk(id);

        if (!productOrder) {
            return res.status(404).json({ error: 'Producto en la orden no encontrado' });
        }

        const oldProduct = await Producto.findByPk(productOrder.id_producto); // Producto anterior
        const newProduct = await Producto.findByPk(id_producto); // Nuevo producto

        if (!newProduct) {
            return res.status(404).json({ error: `Producto con id ${id_producto} no encontrado` });
        }

        // Devolver el stock del producto anterior
        if (oldProduct) {
            oldProduct.stock += productOrder.cantidad;
            await oldProduct.save();
        }

        // Verificamos que haya suficiente stock en el nuevo producto
        if (newProduct.stock < cantidad) {
            return res.status(400).json({ error: `Stock insuficiente para el producto con id ${id_producto}` });
        }

        // Reducimos el stock del nuevo producto
        newProduct.stock -= cantidad;
        await newProduct.save();

        // Actualizamos el registro de la orden con el nuevo producto y cantidad
        await productOrder.update({
            id_producto,
            cantidad
        });

        res.status(200).json(productOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un producto de una orden
export const removeProductFromOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const productOrder = await ProductoOrden.findByPk(id);
        if (productOrder) {
            await productOrder.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Producto no encontrado en la orden' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
