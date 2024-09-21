// controllers/plantillaOrdenController.js
import PlantillaOrden from '../models/plantillaOrdenModel.js';



// controllers/plantillaOrdenController.js
export const createMultiplePlantillasOrden = async (req, res) => {
  try {
    const { id_orden, plantillas } = req.body; // plantillas será un array de id_grupo

    if (!plantillas || plantillas.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron plantillas para asignar' });
    }

    // Crear múltiples relaciones de una sola vez
    const relaciones = plantillas.map(id_grupo => ({
      id_orden,
      id_grupo,
    }));

    // Usar bulkCreate para insertar todas las relaciones a la vez
    const nuevasRelaciones = await PlantillaOrden.bulkCreate(relaciones);

    res.status(201).json(nuevasRelaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar las plantillas a la orden', error });
  }
};

export const getAllPlantillasOrden = async (req, res) => {
  try {
    const relaciones = await PlantillaOrden.findAll();
    res.status(200).json(relaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las relaciones', error });
  }
};

export const getPlantillasByOrden = async (req, res) => {
  try {
    const { id_orden } = req.params;

    // Buscar todas las relaciones de plantillas para la orden específica
    const plantillasOrden = await PlantillaOrden.findAll({
      where: { id_orden },
    });

    if (plantillasOrden.length === 0) {
      return res.status(404).json({ message: 'No se encontraron plantillas asignadas a esta orden' });
    }

    res.status(200).json(plantillasOrden);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las plantillas asignadas a la orden', error });
  }
};

export const deletePlantillaOrden = async (req, res) => {
  try {
    const { id_plantillaorden } = req.params;

    // Buscar la relación y eliminarla
    const relacion = await PlantillaOrden.findByPk(id_plantillaorden);
    if (!relacion) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }

    await relacion.destroy();
    res.status(200).json({ message: 'Relación eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la relación', error });
  }
};
