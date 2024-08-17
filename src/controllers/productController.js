// controllers/productController.js
import Producto from '../models/productModel.js';

export const getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ include: 'categoriaProducto' });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { id_catprod, nombreProducto, codigoProducto, precio, stock } = req.body;
    const nuevoProducto = await Producto.create({
      id_catprod,
      nombreProducto,
      codigoProducto,
      precio,
      stock,
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, { include: 'categoriaProducto' });
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_catprod, nombreProducto, codigoProducto, precio, stock } = req.body;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    producto.id_catprod = id_catprod;
    producto.nombreProducto = nombreProducto;
    producto.codigoProducto = codigoProducto;
    producto.precio = precio;
    producto.stock = stock;
    await producto.save();
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await producto.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};
