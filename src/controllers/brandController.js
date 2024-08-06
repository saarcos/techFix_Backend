import { z } from 'zod';
import  Marca  from '../models/brandModel.js';

export const marcaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no debe exceder 50 caracteres')
});

// Crear una nueva marca
export const createMarca = async (req, res) => {
    const result = marcaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const { nombre } = result.data;
  
    try {
      const newMarca = await Marca.create({ nombre });
      res.status(201).json(newMarca);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Obtener todas las marcas
  export const getMarcas = async (req, res) => {
    try {
      const marcas = await Marca.findAll();
      res.status(200).json(marcas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Obtener una marca por ID
  export const getMarcaById = async (req, res) => {
    const { id } = req.params;
    try {
      const marca = await Marca.findByPk(id);
      if (marca) {
        res.status(200).json(marca);
      } else {
        res.status(404).json({ error: 'Marca no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Actualizar una marca
  export const updateMarca = async (req, res) => {
    const { id } = req.params;
    const result = marcaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const { nombre } = result.data;
  
    try {
      const marca = await Marca.findByPk(id);
      if (marca) {
        await marca.update({ nombre });
        res.status(200).json(marca);
      } else {
        res.status(404).json({ error: 'Marca no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Eliminar una marca
  export const deleteMarca = async (req, res) => {
    const { id } = req.params;
    try {
      const marca = await Marca.findByPk(id);
      if (marca) {
        await marca.destroy();
        res.status(204).json();
      } else {
        res.status(404).json({ error: 'Marca no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };