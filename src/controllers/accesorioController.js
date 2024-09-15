import Accesorio from '../models/accesorioModel.js';
import { z } from 'zod';

const accesorioSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }).max(50, { message: "El nombre no debe exceder los 50 caracteres" })
});

// Crear un accesorio
export const createAccesorio = async (req, res) => {
    try {
      // Validar los datos usando Zod
      const validatedData = accesorioSchema.parse(req.body);
      
      // Si la validación es exitosa, crear el accesorio
      const newAccesorio = await Accesorio.create(validatedData);
      res.status(201).json(newAccesorio);
    } catch (error) {
      // Si ocurre un error de validación, se maneja aquí
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
};
  // Obtener todos los accesorios
export const getAccesorios = async (req, res) => {
    try {
      const accesorios = await Accesorio.findAll();
      res.status(200).json(accesorios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
// Método para obtener un accesorio por ID
export const getAccesorioById = async (req, res) => {
    const { id_accesorio } = req.params;
    try {
      const accesorio = await Accesorio.findByPk(id_accesorio);
      if (!accesorio) {
        return res.status(404).json({ message: 'Accesorio no encontrado' });
      }
      res.status(200).json(accesorio);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// Actualizar un accesorio por ID
export const updateAccesorio = async (req, res) => {
    const { id_accesorio } = req.params;
    try {
      const accesorio = await Accesorio.findByPk(id_accesorio);
      if (!accesorio) {
        return res.status(404).json({ message: 'Accesorio no encontrado' });
      }
  
      // Validar los datos usando Zod
      const validatedData = accesorioSchema.parse(req.body);
      
      // Si la validación es exitosa, actualizar el accesorio
      accesorio.nombre = validatedData.nombre;
      await accesorio.save();
      res.status(200).json(accesorio);
    } catch (error) {
      // Si ocurre un error de validación, se maneja aquí
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
};
  
  // Eliminar un accesorio
export const deleteAccesorio = async (req, res) => {
    const { id_accesorio } = req.params;
    try {
      const accesorio = await Accesorio.findByPk(id_accesorio);
      if (!accesorio) {
        return res.status(404).json({ message: 'Accesorio no encontrado' });
      }
      await accesorio.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};