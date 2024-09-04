// controllers/plantillaController.js
import Plantilla from '../models/plantillaModel.js';
import GrupoTareas from '../models/grupoTareasModel.js';
import Tarea from '../models/tareaModel.js';
import TareasOrden from '../models/tareasOrdenModel.js';

export const createPlantilla = async (req, res) => {
  try {
    const { descripcion, tareas } = req.body;

    // Crear la nueva plantilla
    const nuevaPlantilla = await Plantilla.create({
      descripcion,
    });

    // Asignar tareas a la plantilla
    if (tareas && tareas.length > 0) {
      const relacionesTareas = tareas.map(id_tarea => ({
        id_tarea,
        id_grupo: nuevaPlantilla.id_grupo,
      }));
      await GrupoTareas.bulkCreate(relacionesTareas);
    }

    res.status(201).json(nuevaPlantilla);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la plantilla', error });
  }
};

export const getAllPlantillas = async (req, res) => {
    try {
      const plantillas = await Plantilla.findAll({
        include: [
          {
            model: GrupoTareas,
            as: 'tareas',
            include: {
              model: Tarea,
              as: 'tarea',
            }
          }
        ]
      });
      res.json(plantillas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las plantillas', error });
    }
};
export const removeTareaFromPlantilla = async (req, res) => {
    try {
      const { id_taskgroup } = req.params;
  
      const relacion = await GrupoTareas.findByPk(id_taskgroup);
      if (!relacion) {
        return res.status(404).json({ message: 'Relación no encontrada' });
      }
  
      await relacion.destroy();
      res.json({ message: 'Tarea eliminada de la plantilla' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la tarea de la plantilla', error });
    }
};
export const updatePlantilla = async (req, res) => {
    try {
      const { id_grupo } = req.params;
      const { descripcion, tareas } = req.body;
  
      const plantilla = await Plantilla.findByPk(id_grupo);
      if (!plantilla) {
        return res.status(404).json({ message: 'Plantilla no encontrada' });
      }
  
      // Actualizar la descripción de la plantilla
      if (descripcion) {
        plantilla.descripcion = descripcion;
      }
  
      await plantilla.save();
  
      // Si se proporcionan nuevas tareas, actualizar las relaciones
      if (tareas && tareas.length > 0) {
        // Eliminar las relaciones existentes
        await GrupoTareas.destroy({ where: { id_grupo } });
  
        // Crear las nuevas relaciones
        const nuevasRelaciones = tareas.map(id_tarea => ({
          id_tarea,
          id_grupo: id_grupo,
        }));
        await GrupoTareas.bulkCreate(nuevasRelaciones);
      }
  
      res.json({ message: 'Plantilla actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la plantilla', error });
    }
};
export const asignarPlantillaAOrden = async (req, res) => {
    try {
      const { id_grupo, id_orden, id_usuario } = req.body;
  
      // Obtener todas las tareas asociadas a la plantilla
      const tareasPlantilla = await GrupoTareas.findAll({
        where: { id_grupo },
        include: {
          model: Tarea,
          as: 'tarea',
        },
      });
      console.log(tareasPlantilla.length)
  
      if (!tareasPlantilla || tareasPlantilla.length === 0) {
        return res.status(404).json({ message: 'No se encontraron tareas para la plantilla seleccionada' });
      }
  
      // Asignar cada tarea a la orden de trabajo
      const tareasOrden = tareasPlantilla.map(tarea => ({
        id_tarea: tarea.id_tarea,
        id_orden: id_orden,
        id_usuario: id_usuario, // El técnico encargado
        status: false, // Iniciar con el estado no completado
      }));
  
      await TareasOrden.bulkCreate(tareasOrden);
      res.status(201).json({ message: 'Plantilla asignada a la orden exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al asignar la plantilla a la orden', error });
    }
  };