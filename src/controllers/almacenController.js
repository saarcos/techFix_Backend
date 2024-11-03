// controllers/almacenController.js
import Almacen from '../models/almacenModel.js';

// Obtener todos los almacenes
export const getAlmacenes = async (req, res) => {
  try {
    const almacenes = await Almacen.findAll();
    res.status(200).json(almacenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un almacén por ID
export const getAlmacenById = async (req, res) => {
  const { id_almacen } = req.params;
  try {
    const almacen = await Almacen.findByPk(id_almacen);
    if (!almacen) {
      return res.status(404).json({ message: 'Almacén no encontrado' });
    }
    res.status(200).json(almacen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo almacén
export const createAlmacen = async (req, res) => {
  const { nombre } = req.body;
  try {
    const nuevoAlmacen = await Almacen.create({ nombre });
    res.status(201).json(nuevoAlmacen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un almacén
export const updateAlmacen = async (req, res) => {
  const { id_almacen } = req.params;
  const { nombre } = req.body;
  try {
    const almacen = await Almacen.findByPk(id_almacen);
    if (!almacen) {
      return res.status(404).json({ message: 'Almacén no encontrado' });
    }
    await almacen.update({ nombre });
    res.status(200).json(almacen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un almacén
export const deleteAlmacen = async (req, res) => {
  const { id_almacen } = req.params;
  try {
    const almacen = await Almacen.findByPk(id_almacen);
    if (!almacen) {
      return res.status(404).json({ message: 'Almacén no encontrado' });
    }
    await almacen.destroy();
    res.status(200).json({ message: 'Almacén eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
