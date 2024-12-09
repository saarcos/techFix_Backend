// controllers/detalleOrdenController.js
import DetalleOrden from '../models/detalleOrdenModel.js';
import Existencias from '../models/existenciasModel.js';
import Producto from '../models/productModel.js';
import Servicio from '../models/serviceModel.js';
import sequelize from '../config/sequelize.js';
import { crearNotificacion } from './notificacionController.js';

// Crear múltiples detalles de orden con verificación de stock
export const createDetallesOrden = async (req, res) => {
  const { detalles } = req.body; // Esperamos un array de detalles en el cuerpo de la solicitud

  try {
    const nuevosDetalles = [];

    for (const detalle of detalles) {
      const {
        id_orden,
        id_usuario,
        id_servicio,
        id_producto,
        precioservicio,
        precioproducto,
        cantidad,
        status,
      } = detalle;

      // Validar que cantidad no sea null o undefined, usar 1 como valor predeterminado
      const cantidadFinal = cantidad !== undefined && cantidad !== null ? cantidad : 1;

      let existencias;
      // Verificar si el producto tiene stock suficiente en Existencias
      if (id_producto) {
        existencias = await Existencias.findOne({
          where: { id_producto },
        });

        if (!existencias || existencias.cantidad < cantidadFinal) {
          return res
            .status(400)
            .json({ message: `Stock insuficiente para el producto con ID ${id_producto}` });
        }
      }

      // Calcular el precio total con validaciones explícitas
      const precioservicioFinal = precioservicio !== undefined && precioservicio !== null ? precioservicio : 0;
      const precioproductoFinal = precioproducto !== undefined && precioproducto !== null ? precioproducto : 0;
      const preciototal = precioproductoFinal * cantidadFinal + precioservicioFinal;

      // Crear el detalle de orden
      const nuevoDetalle = await DetalleOrden.create({
        id_orden,
        id_usuario,
        id_servicio,
        id_producto,
        precioservicio: precioservicioFinal,
        precioproducto: precioproductoFinal,
        cantidad: cantidadFinal,
        preciototal,
        status,
      });

      // Si hay stock, actualizar la cantidad en Existencias
      if (id_producto) {
        await existencias.update({ cantidad: existencias.cantidad - cantidadFinal });
      }
       // Verificar y crear notificación si es necesario
       if (id_usuario && status!== true) {
          await crearNotificacion(
            id_usuario,
            id_orden,
            `Se te ha asignado un nuevo detalle en la orden.`
          );
      }
      nuevosDetalles.push(nuevoDetalle);
    }

    res.status(201).json(nuevosDetalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener todos los detalles de una orden con productos y servicios
export const getDetallesOrden = async (req, res) => {
  try {
    const detalles = await DetalleOrden.findAll({
      include: [
        {
          model: Producto, 
          as: 'producto', 
          attributes: ['nombreProducto', 'preciofinal', 'preciosiniva', 'iva'], 
        },
        {
          model: Servicio, 
          as: 'servicio', 
          attributes: ['nombre', 'preciofinal','preciosiniva', 'iva'], 
        }
      ]
    });
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Obtener todos los detalles de una orden específica con productos y servicios
export const getDetallesByOrdenId = async (req, res) => {
  const { id_orden } = req.params; // Ahora usamos id_orden como parámetro
  try {
    const detalles = await DetalleOrden.findAll({
      where: { id_orden: id_orden }, // Filtrar por id_orden en lugar de id_detalle
      include: [
        {
          model: Producto, 
          as: 'producto', 
          attributes: ['nombreProducto', 'preciofinal', 'preciosiniva', 'iva'], 
        },
        {
          model: Servicio, 
          as: 'servicio', 
          attributes: ['nombre', 'preciofinal','preciosiniva', 'iva'], 
        }
      ]
    });
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un detalle de orden (sin modificar stock)
export const updateDetalleOrden = async (req, res) => {
  const { id_detalle } = req.params;
  const { id_servicio, id_producto, precioservicio, precioproducto, cantidad, status } = req.body;
  try {
    const detalle = await DetalleOrden.findByPk(id_detalle);
    if (!detalle) {
      return res.status(404).json({ message: 'Detalle de orden no encontrado' });
    }
    // Calcular el precio total actualizado
    const preciototal = (precioproducto || 0) * cantidad + (precioservicio || 0);

    await detalle.update({
      id_servicio,
      id_producto,
      precioservicio,
      precioproducto,
      cantidad,
      preciototal,
      status,
    });

    res.status(200).json(detalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un detalle de orden y restablecer el stock
export const deleteDetalleOrden = async (req, res) => {
  const { id_detalle } = req.params;

  try {
    const detalle = await DetalleOrden.findByPk(id_detalle);
    if (!detalle) {
      return res.status(404).json({ message: 'Detalle de orden no encontrado' });
    }

    // Restablecer el stock si se elimina un detalle de orden con un producto
    if (detalle.id_producto) {
      const existencias = await Existencias.findOne({ where: { id_producto: detalle.id_producto } });
      if (existencias) {
        await existencias.update({ cantidad: existencias.cantidad + detalle.cantidad });
      }
    }

    // Eliminar el detalle de orden
    await detalle.destroy();
    res.status(200).json({ message: 'Detalle de orden eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Controlador: Obtener el rendimiento de los técnicos desde la tabla detalleorden
export const getTechnicianPerformance = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        CONCAT(u.nombre, ' ', u.apellido) AS technician_name,
        SUM(d.preciototal) AS total_revenue
      FROM "detalleorden" d
      JOIN "usuario" u ON d.id_usuario = u.id_usuario
      WHERE d.id_usuario IS NOT NULL 
      GROUP BY u.id_usuario, u.nombre, u.apellido
      ORDER BY total_revenue DESC
      LIMIT 5; 
    `);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error al obtener el rendimiento de los técnicos:", error);
    res.status(500).json({ error: "Error al obtener el rendimiento de los técnicos" });
  }
};