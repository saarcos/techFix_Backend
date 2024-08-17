// controllers/serviceCategoryController.js
import CategoriaServicio from '../models/serviceCategoryModel.js';

export const getAllCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaServicio.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías', error });
  }
};

export const createCategoria = async (req, res) => {
  try {
    const { nombreCat } = req.body;
    const nuevaCategoria = await CategoriaServicio.create({ nombreCat });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría', error });
  }
};

export const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaServicio.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría', error });
  }
};

export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCat } = req.body;
    const categoria = await CategoriaServicio.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    categoria.nombreCat = nombreCat;
    await categoria.save();
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría', error });
  }
};

export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaServicio.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    await categoria.destroy();
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error });
  }
};
