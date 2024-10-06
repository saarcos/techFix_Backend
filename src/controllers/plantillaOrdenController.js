// controllers/plantillaOrdenController.js
import GrupoTareas from '../models/grupoTareasModel.js';
import PlantillaOrden from '../models/plantillaOrdenModel.js';
import ProductoTarea from '../models/productoTarea.js';
import ServicioTarea from '../models/servicioTarea.js';
import TareaOrden from '../models/tareaOrdenModel.js';
import ProductoOrden from '../models/productOrdenModel.js';
import ServicioOrden from '../models/servicioOrdenModel.js'
export const createMultiplePlantillasOrden = async (req, res) => {
  try {
    const { id_orden, plantillas } = req.body; // plantillas será un array de id_grupo

    if (!plantillas || plantillas.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron plantillas para asignar' });
    }

    // Crear múltiples relaciones para las plantillas
    const relaciones = plantillas.map(id_grupo => ({
      id_orden,
      id_grupo,
    }));
    
    // Usar bulkCreate para insertar todas las relaciones de plantillas a la vez
    await PlantillaOrden.bulkCreate(relaciones);

    // Conjuntos para almacenar productos y servicios ya agregados
    const productosAgregados = new Set();
    const serviciosAgregados = new Set();

    // Ahora buscar y crear las tareas correspondientes en TareaOrden
    for (const id_grupo of plantillas) {
      // Obtener las tareas asociadas al grupo (id_grupo) desde la tabla intermedia grupotareas
      const grupoTareas = await GrupoTareas.findAll({ where: { id_grupo } });

      // Iterar sobre las tareas del grupo
      for (const grupoTarea of grupoTareas) {
        // Verificar si ya existe una relación en TareaOrden con esta tarea y orden
        const [tareaOrden] = await TareaOrden.findOrCreate({
          where: {
            id_tarea: grupoTarea.id_tarea,
            id_orden
          },
          defaults: {
            status: false, // Valor por defecto
          }
        });

        // Obtener los productos asociados a la tarea
        const productos = await ProductoTarea.findAll({ where: { id_tarea: grupoTarea.id_tarea } });
        const servicios = await ServicioTarea.findAll({ where: { id_tarea: grupoTarea.id_tarea } });

        // Crear relaciones de productos en TareaOrden
        for (const producto of productos) {
          if (!productosAgregados.has(producto.id_producto)) {
            await ProductoOrden.create({
              id_orden, id_orden,
              id_producto: producto.id_producto,
              id_tareaorden: tareaOrden.id, // Asegúrate de que la relación esté bien configurada
              cantidad: producto.cantidad
            });
            productosAgregados.add(producto.id_producto); // Agregar al conjunto
          }
        }
        // Crear relaciones de servicios en TareaOrden
        for (const servicio of servicios) {
          if (!serviciosAgregados.has(servicio.id_servicio)) {
            await ServicioOrden.create({
              id_orden: id_orden,
              id_servicio: servicio.id_servicio,
              id_tareaorden: tareaOrden.id // Asegúrate de que la relación esté bien configurada
            });
            serviciosAgregados.add(servicio.id_servicio); // Agregar al conjunto
          }
        }
      }
    }

    res.status(201).json({ message: 'Plantillas, tareas, productos y servicios asignados correctamente' });
  } catch (error) {
    console.error('Error:', error); // Agrega este log para ver el error en la consola
    res.status(500).json({ message: 'Error al asignar las plantillas y tareas a la orden', error: error.message });
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
