import { z } from 'zod';
import Modelo from '../models/modelModel.js';
export const modeloSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no debe exceder 50 caracteres'),
  id_marca: z.number().int()
});
// Crear un nuevo modelo
export const createModelo = async (req, res) => {
    const result = modeloSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const { nombre, id_marca} = result.data;
  
    try {
      const newModelo = await Modelo.create({ nombre: nombre, id_marca:id_marca });
      res.status(201).json(newModelo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Obtener todos los modelos
  export const getModelos = async (req, res) => {
    try {
      const modelos = await Modelo.findAll();
      res.status(200).json(modelos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Obtener un modelo por ID
  export const getModeloById = async (req, res) => {
    const { id } = req.params;
    try {
      const modelo = await Modelo.findByPk(id);
      if (modelo) {
        res.status(200).json(modelo);
      } else {
        res.status(404).json({ error: 'Modelo no encontrado' });
      }
    } catch (error) {
      res.status (500).json({ error: error.message });
    }
  };
  
  // Actualizar un modelo
  export const updateModelo = async (req, res) => {
    const { id } = req.params;
    const result = modeloSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const { nombre, id_marca} = result.data;
  
    try {
      const modelo = await Modelo.findByPk(id);
      if (modelo) {
        await modelo.update({ nombre: nombre, id_marca:id_marca});
        res.status(200).json(modelo);
      } else {
        res.status(404).json({ error: 'Modelo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Eliminar un modelo
  export const deleteModelo = async (req, res) => {
    const { id } = req.params;
    try {
      const modelo = await Modelo.findByPk(id);
      if (modelo) {
        await modelo.destroy();
        res.status(204).json();
      } else {
        res.status(404).json({ error: 'Modelo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
