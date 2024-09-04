// controllers/tareaController.js
import Tarea from '../models/tareaModel.js';
import ProductoTarea from '../models/productoTarea.js';
import ServicioTarea from '../models/servicioTarea.js';
import Producto from '../models/productModel.js';
import Servicio from '../models/serviceModel.js';
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
export const createTarea = async (req, res) => {
  try {
    const { titulo, tiempo, descripcion } = req.body;
    const nuevaTarea = await Tarea.create({
      titulo,
      tiempo,
      descripcion,
    });
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error });
  }
};

export const getTareaById = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea', error });
  }
};

export const updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, tiempo, descripcion } = req.body;
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    tarea.titulo = titulo;
    tarea.tiempo = tiempo;
    tarea.descripcion = descripcion;
    await tarea.save();
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
  try {
    const { id_tarea, id_producto, cantidad } = req.body;

    // Buscar el producto en la base de datos
    const producto = await Producto.findByPk(id_producto);

    // Verificar si el producto existe
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si hay suficiente stock disponible
    if (producto.stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }

    // Reducir el stock del producto
    producto.stock -= cantidad;
    await producto.save();

    // Crear la relación entre la tarea y el producto
    const nuevaRelacion = await ProductoTarea.create({
      id_tarea,
      id_producto,
      cantidad,
    });

    res.status(201).json(nuevaRelacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el producto a la tarea', error });
  }
};
export const addServicioToTarea = async (req, res) => {
  try {
    const { id_tarea, id_servicio } = req.body;
    const nuevaRelacion = await ServicioTarea.create({
      id_tarea,
      id_servicio,
    });
    res.status(201).json(nuevaRelacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el servicio a la tarea', error });
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
