// controllers/detalleOrdenController.js
import DetalleOrden from '../models/detalleOrdenModel.js';
import Existencias from '../models/existenciasModel.js';
import Producto from '../models/productModel.js';
import Servicio from '../models/serviceModel.js';
import sequelize from '../config/sequelize.js';

// Crear múltiples detalles de orden con verificación de stock
export const createDetallesOrden = async (req, res) => {
  const { detalles } = req.body; // Esperamos un array de detalles en el cuerpo de la solicitud

  try {
    const nuevosDetalles = [];

    for (const detalle of detalles) {
      const { id_orden, id_usuario, id_servicio, id_producto, precioservicio, precioproducto, cantidad, status } = detalle;

      let existencias;
      // Verificar si el producto tiene stock suficiente en Existencias
      if (id_producto) {
        existencias = await Existencias.findOne({
          where: { id_producto },
        });

        if (!existencias || existencias.cantidad < cantidad) {
          return res.status(400).json({ message: `Stock insuficiente para el producto con ID ${id_producto}` });
        }
      }

      // Calcular el precio total
      const preciototal = (precioproducto || 0) * cantidad + (precioservicio || 0);

      // Crear el detalle de orden
      const nuevoDetalle = await DetalleOrden.create({
        id_orden,
        id_usuario,
        id_servicio,
        id_producto,
        precioservicio,
        precioproducto,
        cantidad,
        preciototal,
        status,
      });

      // Si hay stock, actualizar la cantidad en Existencias
      if (id_producto) {
        await existencias.update({ cantidad: existencias.cantidad - cantidad });
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
          attributes: ['nombreProducto', 'preciofinal'], 
        },
        {
          model: Servicio, 
          as: 'servicio', 
          attributes: ['nombre', 'preciofinal'], 
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
          attributes: ['nombreProducto', 'preciofinal'], 
        },
        {
          model: Servicio, 
          as: 'servicio', 
          attributes: ['nombre', 'preciofinal'], 
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
export const getProductStockAndSales = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
          p.nombreproducto AS product_name,
          COUNT(d.id_producto) AS total_sold,
          COALESCE(SUM(d.preciototal), 0) AS total_revenue,
          COALESCE(SUM(e.cantidad), 0) AS current_stock
      FROM producto p
      INNER JOIN detalleorden d ON p.id_producto = d.id_producto
      LEFT JOIN existencias e ON p.id_producto = e.id_producto
      GROUP BY p.nombreproducto
      ORDER BY total_sold DESC
      LIMIT 5;
    `);

    // Formatear la respuesta para adaptarla al frontend
    const formattedResults = results.map((row) => ({
      product: row.product_name,
      stock: parseInt(row.current_stock, 10),
      used: parseInt(row.total_sold, 10),
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error("Error al obtener los productos más vendidos:", error);
    res.status(500).json({ error: "Error al obtener los productos más vendidos" });
  }
};
