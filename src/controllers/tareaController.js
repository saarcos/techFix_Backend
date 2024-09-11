// controllers/tareaController.js
import Tarea from '../models/tareaModel.js';
import ProductoTarea from '../models/productoTarea.js';
import ServicioTarea from '../models/servicioTarea.js';
import Producto from '../models/productModel.js';
import Servicio from '../models/serviceModel.js';
import sequelize from '../config/sequelize.js';

export const getAllTareas = async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      include: [
        {
          model: ProductoTarea,
          as: 'productos',
          include: {
            model: Producto,
            as: 'producto'
          }
        },
        {
          model: ServicioTarea,
          as: 'servicios',
          include: {
            model: Servicio,
            as: 'servicio'
          }
        }
      ]
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas', error });
  }
};
export const getTareaById = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findByPk(id, {
      include: [
        {
          model: ProductoTarea,
          as: 'productos',
          include: {
            model: Producto,
            as: 'producto'
          }
        },
        {
          model: ServicioTarea,
          as: 'servicios',
          include: {
            model: Servicio,
            as: 'servicio'
          }
        }
      ]
    });

    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea', error });
  }
};

export const createTarea = async (req, res) => {
  const { titulo, tiempo, descripcion } = req.body;

  try {
    // Crear solo la tarea
    const nuevaTarea = await Tarea.create({
      titulo,
      tiempo,
      descripcion,
    });

    // Devolver la tarea creada con su ID
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
};



export const updateTarea = async (req, res) => {
  const { id } = req.params;
  const { titulo, tiempo, descripcion, productos, servicios } = req.body;
  
  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Actualizar los campos de la tarea
    tarea.titulo = titulo;
    tarea.tiempo = tiempo;
    tarea.descripcion = descripcion;
    await tarea.save();

    // Actualizar los productos (incluso si el array está vacío)
    // Eliminar todas las relaciones de productos
    await ProductoTarea.destroy({ where: { id_tarea: id } });

    if (productos && productos.length > 0) {
      for (const prod of productos) {
        const { id_producto, cantidad } = prod;

        const producto = await Producto.findByPk(id_producto);
        if (!producto) {
          return res.status(404).json({ message: `Producto con ID ${id_producto} no encontrado` });
        }

        // Crear la nueva relación producto-tarea
        await ProductoTarea.create({
          id_tarea: tarea.id_tarea,
          id_producto,
          cantidad,
        });
      }
    }

    // Actualizar los servicios (incluso si el array está vacío)
    // Eliminar todas las relaciones de servicios
    await ServicioTarea.destroy({ where: { id_tarea: id } });

    if (servicios && servicios.length > 0) {
      for (const serv of servicios) {
        const { id_servicio } = serv;

        const servicio = await Servicio.findByPk(id_servicio);
        if (!servicio) {
          return res.status(404).json({ message: `Servicio con ID ${id_servicio} no encontrado` });
        }

        // Crear la nueva relación servicio-tarea
        await ServicioTarea.create({
          id_tarea: tarea.id_tarea,
          id_servicio,
        });
      }
    }

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea', error });
  }
};


export const deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    await tarea.destroy();
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
};

//Relaciones con producto y tarea
export const addProductoToTarea = async (req, res) => {
  const { id_tarea, productos } = req.body;

  const transaction = await sequelize.transaction();
  try {
    for (const { id_producto, cantidad } of productos) {
      const producto = await Producto.findByPk(id_producto, { transaction });

      if (!producto) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      await producto.save({ transaction });

      await ProductoTarea.create({
        id_tarea,
        id_producto,
        cantidad,
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: 'Productos añadidos a la tarea' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al añadir productos', error });
  }
};
export const addServicioToTarea = async (req, res) => {
  const { id_tarea, servicios } = req.body;

  const transaction = await sequelize.transaction();
  try {
    for (const { id_servicio } of servicios) {
      const servicio = await Servicio.findByPk(id_servicio, { transaction });

      if (!servicio) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }

      await ServicioTarea.create({
        id_tarea,
        id_servicio,
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: 'Servicios añadidos a la tarea' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al añadir servicios', error });
  }
};
export const updateProductoInTarea = async (req, res) => {
  try {
    const { id_taskprod } = req.params;
    const { id_producto, cantidad } = req.body;

    const productoTarea = await ProductoTarea.findByPk(id_taskprod);
    if (!productoTarea) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }

    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si el producto cambió o si la cantidad es diferente
    if (productoTarea.id_producto !== id_producto || productoTarea.cantidad !== cantidad) {
      // Si el producto o la cantidad cambió, revertimos el stock del producto anterior
      const productoAnterior = await Producto.findByPk(productoTarea.id_producto);
      if (productoAnterior) {
        productoAnterior.stock += productoTarea.cantidad;
        await productoAnterior.save();
      }

      // Verificar si hay suficiente stock para el nuevo producto o la nueva cantidad
      if (producto.stock < cantidad) {
        return res.status(400).json({ message: 'Stock insuficiente' });
      }

      // Reducir el stock del nuevo producto
      producto.stock -= cantidad;
      await producto.save();

      // Actualizar la relación
      productoTarea.id_producto = id_producto;
      productoTarea.cantidad = cantidad;
      await productoTarea.save();

      res.json(productoTarea);
    } else {
      // Si no hay cambios en el producto o la cantidad, solo devolvemos la relación actualizada
      res.json(productoTarea);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto en la tarea', error });
  }
};
export const updateServicioInTarea = async (req, res) => {
  try {
    const { id_taskserv } = req.params;
    const { id_servicio } = req.body;

    const servicioTarea = await ServicioTarea.findByPk(id_taskserv);
    if (!servicioTarea) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }

    servicioTarea.id_servicio = id_servicio;

    await servicioTarea.save();
    res.json(servicioTarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servicio en la tarea', error });
  }
};
export const deleteProductoFromTarea = async (req, res) => {
  try {
    const { id_taskprod } = req.params;

    const productoTarea = await ProductoTarea.findByPk(id_taskprod);
    if (!productoTarea) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }

    await productoTarea.destroy();
    res.json({ message: 'Producto eliminado de la tarea' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto de la tarea', error });
  }
};
export const deleteServicioFromTarea = async (req, res) => {
  try {
    const { id_taskserv } = req.params;

    const servicioTarea = await ServicioTarea.findByPk(id_taskserv);
    if (!servicioTarea) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }

    await servicioTarea.destroy();
    res.json({ message: 'Servicio eliminado de la tarea' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio de la tarea', error });
  }
};
