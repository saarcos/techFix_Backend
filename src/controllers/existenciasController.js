// controllers/existenciasController.js
import Existencias from '../models/existenciasModel.js';
import Almacen from '../models/almacenModel.js';
import Producto from '../models/productModel.js';

// Obtener todas las existencias
export const getExistencias = async (req, res) => {
  try {
    const existencias = await Existencias.findAll({
      include: [
        { model: Almacen, as: 'almacen', attributes: ['nombre'] },
        { model: Producto, as: 'producto', attributes: ['nombreProducto'] },  // Ajusta el atributo según el nombre del campo en tu modelo de producto
      ],
    });
    res.status(200).json(existencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener existencia por ID
export const getExistenciaById = async (req, res) => {
  const { id_existencias } = req.params;
  try {
    const existencia = await Existencias.findByPk(id_existencias, {
      include: [
        { model: Almacen, as: 'almacen', attributes: ['nombre'] },
        { model: Producto, as: 'producto', attributes: ['nombreProducto'] },
      ],
    });
    if (!existencia) {
      return res.status(404).json({ message: 'Existencia no encontrada' });
    }
    res.status(200).json(existencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva existencia
export const createExistencia = async (req, res) => {
  const { id_almacen, id_producto, cantidad } = req.body;
  try {
    const nuevaExistencia = await Existencias.create({ id_almacen, id_producto, cantidad });
    res.status(201).json(nuevaExistencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una existencia
export const updateExistencia = async (req, res) => {
  const { id_existencias } = req.params;
  const { id_almacen, id_producto, cantidad } = req.body;
  try {
    const existencia = await Existencias.findByPk(id_existencias);
    if (!existencia) {
      return res.status(404).json({ message: 'Existencia no encontrada' });
    }
    await existencia.update({ id_almacen, id_producto, cantidad });
    res.status(200).json(existencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una existencia
export const deleteExistencia = async (req, res) => {
  const { id_existencias } = req.params;
  try {
    const existencia = await Existencias.findByPk(id_existencias);
    if (!existencia) {
      return res.status(404).json({ message: 'Existencia no encontrada' });
    }
    await existencia.destroy();
    res.status(200).json({ message: 'Existencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
