import AccesoriosDeOrden from '../models/accesorioOrdenModel.js';
import { z } from 'zod';

const accesorioOrdenSchema = z.object({
  id_orden: z.number().int().min(1, { message: "ID de la orden debe ser un entero positivo" }),
  id_accesorio: z.number().int().min(1, { message: "ID del accesorio debe ser un entero positivo" })
});
// Añadir accesorio a una orden de trabajo
export const addAccesorioToOrden = async (req, res) => {
    try {
      // Validar los datos usando Zod
      const validatedData = accesorioOrdenSchema.parse(req.body);
  
      // Si la validación es exitosa, crear el registro de accesorio en la orden
      const newAccesorioOrden = await AccesoriosDeOrden.create(validatedData);
      res.status(201).json(newAccesorioOrden);
    } catch (error) {
      // Si ocurre un error de validación, se maneja aquí
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
};
  
  // Obtener accesorios de una orden
export const getAccesoriosByOrden = async (req, res) => {
    const { id_orden } = req.params;
    try {
      const accesoriosDeOrden = await AccesoriosDeOrden.findAll({
        where: { id_orden },
        include: ['Accesorio']  // Asegúrate de definir la asociación en el modelo
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