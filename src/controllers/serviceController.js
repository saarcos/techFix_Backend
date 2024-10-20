// controllers/serviceController.js
import Servicio from '../models/serviceModel.js';

export const getAllServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({ include: 'categoriaServicio' });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los servicios', error });
  }
};

export const createServicio = async (req, res) => {
  try {
    const { id_catserv, nombre, preciosiniva, preciofinal, iva } = req.body;
    const nuevoServicio = await Servicio.create({
      id_catserv,
      nombre,
      preciosiniva,
      preciofinal,
      iva,
    });
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el servicio', error });
  }
};

export const getServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id, { include: 'categoriaServicio' });
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el servicio', error });
  }
};

export const updateServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_catserv, nombre, preciosiniva, preciofinal, iva } = req.body;
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    servicio.id_catserv = id_catserv;
    servicio.nombre = nombre;
    servicio.preciosiniva = preciosiniva;
    servicio.preciofinal = preciofinal;
    servicio.iva = iva;
    await servicio.save();
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servicio', error });
  }
};

export const deleteServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    await servicio.destroy();
    res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio', error });
  }
};
