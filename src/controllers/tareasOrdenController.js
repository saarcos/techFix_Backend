// controllers/tareasOrdenController.js
import TareasOrden from '../models/tareasOrdenModel.js';
import Tarea from '../models/tareaModel.js';
import { z } from 'zod';

const asignarTareasSchema = z.object({
  id_orden: z.number().int().positive(),
  id_usuario: z.number().int().positive(),
  tareas: z.array(z.number().int().positive()),
});

const actualizarEstadoTareaSchema = z.object({
  status: z.boolean(),
});
const actualizarTareaOrdenSchema = z.object({
    id_usuario: z.number().int().positive().optional(),
    status: z.boolean().optional(),
});

export const obtenerTareasPorOrden = async (req, res) => {
    try {
      const { id_orden } = req.params;
  
      const tareasOrden = await TareasOrden.findAll({
        where: { id_orden },
        include: [
          {
            model: Tarea,
            as: 'tarea',
            attributes: ['titulo', 'descripcion', 'tiempo'],
          },
        ],
      });
  
      res.json(tareasOrden);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las tareas de la orden', error });
    }
  };
  export const asignarTareasAOrden = async (req, res) => {
    try {
      const validationResult = asignarTareasSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.error.errors });
      }
  
      const { id_orden, id_usuario, tareas } = validationResult.data;
  
      const relaciones = tareas.map(id_tarea => ({
        id_tarea,
        id_orden,
        id_usuario,
      }));
  
      await TareasOrden.bulkCreate(relaciones);
      res.status(201).json({ message: 'Tareas asignadas a la orden exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al asignar tareas a la orden', error });
    }
};
export const actualizarTareaOrden = async (req, res) => {
    try {
      const { id_taskord } = req.params;
      
      const validationResult = actualizarTareaOrdenSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.error.errors });
      }
  
      const { id_usuario, status } = validationResult.data;
  
      const tareaOrden = await TareasOrden.findByPk(id_taskord);
      if (!tareaOrden) {
        return res.status(404).json({ message: 'Tarea no encontrada en la orden' });
      }
  
      if (id_usuario !== undefined) {
        tareaOrden.id_usuario = id_usuario;
      }
      if (status !== undefined) {
        tareaOrden.status = status;
      }
  
      await tareaOrden.save();
      res.json(tareaOrden);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la tarea en la orden', error });
    }
  };
export const actualizarEstadoTareaOrden = async (req, res) => {
    try {
      const validationResult = actualizarEstadoTareaSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.error.errors });
      }
  
      const { id_taskord } = req.params;
      const { status } = validationResult.data;
  
      const tareaOrden = await TareasOrden.findByPk(id_taskord);
      if (!tareaOrden) {
        return res.status(404).json({ message: 'Tarea no encontrada en la orden' });
      }
  
      tareaOrden.status = status;
      await tareaOrden.save();
  
      res.json(tareaOrden);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado de la tarea en la orden', error });
    }
};
export const eliminarTareaDeOrden = async (req, res) => {
    try {
      const { id_taskord } = req.params;
  
      const tareaOrden = await TareasOrden.findByPk(id_taskord);
      if (!tareaOrden) {
        return res.status(404).json({ message: 'Tarea no encontrada en la orden' });
      }
  
      await tareaOrden.destroy();
      res.json({ message: 'Tarea eliminada de la orden exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la tarea de la orden', error });
    }
};