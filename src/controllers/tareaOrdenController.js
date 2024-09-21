// controllers/tareaOrdenController.js
import TareaOrden from '../models/tareaOrdenModel.js'
import Tarea from '../models/tareaModel.js';
import Usuario from '../models/userModel.js';
import { z } from 'zod';
import sequelize from '../config/sequelize.js';
import ProductoTarea from '../models/productoTarea.js';
import Producto from '../models/productModel.js';

// Validación con Zod
const tareaOrdenSchema = z.object({
  id_tarea: z.number().int().positive(),
  id_orden: z.number().int().positive(),
  id_usuario: z.number().int().optional(),
  status: z.boolean().optional(),
});

// Validación para un array de tareas
const tareasOrdenSchema = z.array(tareaOrdenSchema);

// Crear múltiples tareas para una orden
export const addTareasToOrder = async (req, res) => {
  const result = tareasOrdenSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const tareas = result.data; // Array de tareas
  const transaction = await sequelize.transaction();

  try {
    // Iterar sobre cada tarea
    for (const tareaData of tareas) {
      const { id_tarea, id_orden, id_usuario, status } = tareaData;

      // Paso 1: Verificar si la tarea tiene productos asociados
      const productosTarea = await ProductoTarea.findAll({
        where: { id_tarea },
        include: [{ model: Producto, as: 'producto', attributes: ['id_producto', 'stock'] }],
        transaction,
      });

      // Paso 2: Validar el stock de cada producto
      for (const prodTarea of productosTarea) {
        const producto = prodTarea.producto;
        if (producto.stock < prodTarea.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.nombreProducto}`);
        }
      }

      // Paso 3: Reducir el stock de cada producto
      for (const prodTarea of productosTarea) {
        const producto = prodTarea.producto;
        producto.stock -= prodTarea.cantidad;
        await producto.save({ transaction });
      }

      // Paso 4: Crear la nueva tarea para la orden
      await TareaOrden.create({ id_tarea, id_orden, id_usuario, status }, { transaction });
    }

    // Confirmar la transacción
    await transaction.commit();

    // Enviar respuesta exitosa
    res.status(201).json({ message: 'Tareas añadidas correctamente a la orden' });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las tareas de una orden
export const getTareasFromOrder = async (req, res) => {
  const { id_orden } = req.params;

  try {
    const tareas = await TareaOrden.findAll({
      where: { id_orden },
      include: [
        {
          model: Tarea,
          as: 'tarea',
          attributes: ['titulo', 'descripcion', 'tiempo'],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'apellido'],
        },
      ],
    });
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar tarea en una orden
export const updateTareaInOrder = async (req, res) => {
  const { id } = req.params;
  const result = tareaOrdenSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  try {
    const tareaOrden = await TareaOrden.findByPk(id);
    if (!tareaOrden) {
      return res.status(404).json({ message: 'Tarea no encontrada en la orden' });
    }
    await tareaOrden.update(result.data);
    res.status(200).json(tareaOrden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar tarea de una orden
export const removeTareaFromOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const tareaOrden = await TareaOrden.findByPk(id);
    if (!tareaOrden) {
      return res.status(404).json({ message: 'Tarea no encontrada en la orden' });
    }
    await tareaOrden.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
