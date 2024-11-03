import AccesoriosDeOrden from '../models/accesorioOrdenModel.js';
import { z } from 'zod';
import OrdenTrabajo from '../models/ordenTrabajoModel.js';
import Accesorio from '../models/accesorioModel.js';
import sequelize from '../config/sequelize.js';

const accesorioOrdenSchema = z.object({
  id_orden: z.number().int().min(1, { message: "ID de la orden debe ser un entero positivo" }),
  id_accesorio: z.number().int().min(1, { message: "ID del accesorio debe ser un entero positivo" })
});

// Esquema para un array de accesorios
const accesorioArraySchema = z.array(accesorioOrdenSchema);
// Añadir accesorios a una orden de trabajo
export const addAccesoriosToOrden = async (req, res) => {
  try {
    // Validar que el cuerpo de la petición sea un array de accesorios
    const validatedData = accesorioArraySchema.parse(req.body.accesorios);

    // Crear todos los accesorios en la orden de trabajo en una sola transacción
    const newAccesoriosOrden = await AccesoriosDeOrden.bulkCreate(validatedData);

    res.status(201).json(newAccesoriosOrden);
  } catch (error) {
    // Manejar errores de validación
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};
// Actualizar los accesorios de una orden
export const updateAccesoriosOrden = async (req, res) => {
  const { id_orden } = req.params;
  const { accesorios } = req.body; // Suponiendo que recibes un array de accesorios en el body

  try {
    // Validar el array de accesorios usando el esquema de Zod
    const validatedAccesorios = accesorioArraySchema.parse(accesorios);

    // Iniciar una transacción para asegurar que los cambios sean atómicos
    const transaction = await sequelize.transaction();

    try {
      // Verificar si la orden de trabajo existe
      const ordenExistente = await OrdenTrabajo.findByPk(id_orden, { transaction });

      if (!ordenExistente) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Orden de trabajo no encontrada' });
      }

      // Crear los nuevos accesorios para la orden
      const nuevosAccesorios = validatedAccesorios.map(accesorio => ({
        id_orden,
        id_accesorio: accesorio.id_accesorio
      }));

      await AccesoriosDeOrden.bulkCreate(nuevosAccesorios, { transaction });

      // Confirmar la transacción
      await transaction.commit();

      res.status(200).json({ message: 'Accesorios actualizados correctamente' });
    } catch (error) {
      // En caso de error, deshacer la transacción
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    // Manejar errores de validación
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};
  
// Controlador para obtener los accesorios de una orden
export const getAccesoriosByOrden = async (req, res) => {
  const { id_orden } = req.params;
  try {
    const accesoriosDeOrden = await AccesoriosDeOrden.findAll({
      where: { id_orden },
      include: [
        {
          model: Accesorio,
          as: 'Accesorio',  // Alias definido en el modelo
          attributes: ['id_accesorio', 'nombre']  // Atributos del accesorio que quieres incluir
        }
      ]
    });
    res.status(200).json(accesoriosDeOrden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  // Eliminar un accesorio de una orden
export const deleteAccesorioFromOrden = async (req, res) => {
    const { id_accesorioord } = req.params;
    try {
      const accesorioOrden = await AccesoriosDeOrden.findByPk(id_accesorioord);
      if (!accesorioOrden) {
        return res.status(404).json({ message: 'Accesorio no encontrado en la orden' });
      }
      await accesorioOrden.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};