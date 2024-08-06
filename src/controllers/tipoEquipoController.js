import { z } from 'zod';
import TipoEquipo from '../models/tipoEquipoModel.js';

export const tipoEquipoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no debe exceder 50 caracteres')
});

// Crear un nuevo tipo de equipo
export const createTipoEquipo = async (req, res) => {
    const result = tipoEquipoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const { nombre } = result.data;
  
    try {
      const newTipoEquipo = await TipoEquipo.create({ nombre });
      res.status(201).json(newTipoEquipo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
// Obtener todos los tipos de equipo
export const getTiposEquipo = async (req, res) => {
    try {
      const tiposEquipo = await TipoEquipo.findAll();
      res.status(200).json(tiposEquipo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
// Obtener un tipo de equipo por ID
export const getTipoEquipoById = async (req, res) => {
    const { id } = req.params;
    try {
      const tipoEquipo = await TipoEquipo.findByPk(id);
      if (tipoEquipo) {
        res.status(200).json(tipoEquipo);
      } else {
        res.status(404).json({ error: 'Tipo de equipo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Actualizar un tipo de equipo
export const updateTipoEquipo = async (req, res) => {
    const { id } = req.params;
    const result = tipoEquipoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const { nombre } = result.data;
  
    try {
      const tipoEquipo = await TipoEquipo.findByPk(id);
      if (tipoEquipo) {
        await tipoEquipo.update({ nombre });
        res.status(200).json(tipoEquipo);
      } else {
        res.status(404).json({ error: 'Tipo de equipo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
// Eliminar un tipo de equipo
export const deleteTipoEquipo = async (req, res) => {
    const { id } = req.params;
    try {
      const tipoEquipo = await TipoEquipo.findByPk(id);
      if (tipoEquipo) {
        await tipoEquipo.destroy();
        res.status(204).json();
      } else {
        res.status(404).json({ error: 'Tipo de equipo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};