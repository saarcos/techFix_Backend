import { z } from 'zod';
import OrdenTrabajo from '../models/ordenTrabajo.js';
import ImagenOrden from '../models/imagenOrden.js';
import Equipo from '../models/equipoModel.js';
import Usuario from '../models/userModel.js';
import Cliente from '../models/clientModel.js';
import Marca from '../models/brandModel.js'
import Modelo from '../models/modelModel.js'
import sequelize from '../config/sequelize.js';
import ProductoOrden from '../models/productOrdenModel.js';
import Producto from '../models/productModel.js';
import ServicioOrden from '../models/servicioOrdenModel.js';
import Servicio from '../models/serviceModel.js';
import TareaOrden from '../models/tareaOrdenModel.js';
import Tarea from '../models/tareaModel.js';

export const ordenTrabajoSchema = z.object({
    id_equipo: z.number().int().min(1, 'El ID del equipo es obligatorio'),
    id_usuario: z.number().int().nullable().optional(), 
    id_cliente: z.number().int().min(1, 'El ID del cliente es obligatorio'),
    area: z.string().min(1, 'El área es obligatoria').max(50, 'El área no debe exceder 50 caracteres'),
    prioridad: z.string().min(1, 'La prioridad es obligatoria').max(50, 'La prioridad no debe exceder 50 caracteres'),
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    estado: z.string().min(1, 'El estado es obligatorio').max(50, 'El estado no debe exceder 50 caracteres'),
    fecha_prometida: z.string().transform((str) => new Date(str)).nullable().optional(),
    presupuesto: z.number().nullable().optional(),
    adelanto: z.number().nullable().optional(),
    total: z.number().nullable().optional(),
    confirmacion: z.boolean().optional(),
    passwordequipo: z.string().nullable().optional(),
    imagenes: z.array(z.string().url()).optional(), 
    total: z.number().optional(),
    confirmacion: z.boolean().optional(),
});
export const getOrdenesTrabajo = async (req, res) => {
  try {
    const ordenes = await OrdenTrabajo.findAll({
      include: [
        {
          model: ImagenOrden,
          as: 'imagenes',
          attributes: ['url_imagen'],
        },
        {
          model: Equipo,
          as: 'equipo',
          attributes: ['nserie'],
          include: [
            {
              model: Marca,
              as: 'marca',
              attributes: ['nombre'], // Trae el nombre de la marca
            },
            {
              model: Modelo,
              as: 'modelo',
              attributes: ['nombre'], // Trae el nombre del modelo
            }
          ],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'apellido', 'email'], // Ajusta estos atributos según tu estructura
        },
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido', 'cedula','correo','celular'], // Ajusta estos atributos según tu estructura
        }
      ]
    });

    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getOrdenTrabajoById = async (req, res) => {
  const { id_orden } = req.params;
  console.log(id_orden)
  try {
    // Buscar la orden de trabajo por su ID
    const orden = await OrdenTrabajo.findByPk(id_orden, {
      include: [
        {
          model: ImagenOrden,
          as: 'imagenes',
          attributes: ['url_imagen'],
        },
        {
          model: Equipo,
          as: 'equipo',
          attributes: ['nserie'],
          include: [
            {
              model: Marca,
              as: 'marca',
              attributes: ['nombre'], // Trae el nombre de la marca
            },
            {
              model: Modelo,
              as: 'modelo',
              attributes: ['nombre'], // Trae el nombre del modelo
            }
          ],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'apellido', 'email'], // Ajusta estos atributos según tu estructura
        },
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido', 'cedula', 'correo', 'celular'], // Ajusta estos atributos según tu estructura
        },
        {
          model: ProductoOrden,
          as: 'productos',
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['nombreProducto', 'precioFinal', 'iva', 'precioSinIVA'], // Incluye el nombre y el precio del producto
            }
          ]
        },
        {
          model: ServicioOrden,
          as: 'servicios',
          include: [
            {
              model: Servicio,
              as: 'servicio',
              attributes: ['nombre', 'precio'], // Incluye el nombre y el precio del servicio
            }
          ]
        },
        {
          model: TareaOrden,
          as: 'tareas',
          include: [
            {
              model: Tarea,
              as: 'tarea',
              attributes: ['titulo', 'descripcion', 'tiempo'] // Incluye la información de la tarea
            },
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'apellido'], // Incluye el nombre del usuario asignado, si aplica
            }
          ]
        }
      ]
    });

    // Si no se encuentra la orden
    if (!orden) {
      return res.status(404).json({ message: 'Orden de trabajo no encontrada' });
    }

    // Enviar la respuesta con la orden encontrada
    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createOrdenTrabajo = async (req, res) => {
  const result = ordenTrabajoSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const {
    id_equipo,
    id_usuario,
    id_cliente,
    area,
    prioridad,
    descripcion,
    estado,
    fecha_prometida,
    presupuesto,
    adelanto,
    total,
    confirmacion,
    passwordequipo,
    imagenes,
  } = result.data;

  const transaction = await sequelize.transaction(); // Definimos la transacción correctamente

  try {
    // Crear la nueva orden de trabajo
    const nuevaOrden = await OrdenTrabajo.create({
      id_equipo,
      id_usuario,
      id_cliente,
      area,
      prioridad,
      descripcion,
      estado,
      fecha_prometida,
      presupuesto,
      adelanto,
      total,
      confirmacion,
      passwordequipo,
    }, { transaction });

    // Si hay imágenes, crearlas y asociarlas con la orden
    if (imagenes && imagenes.length > 0) {
      const imagenesData = imagenes.map(url => ({
        id_orden: nuevaOrden.id_orden,
        url_imagen: url,
      }));

      await ImagenOrden.bulkCreate(imagenesData, { transaction });
    }

    // Confirmar la transacción
    await transaction.commit();

    res.status(201).json(nuevaOrden);
  } catch (error) {
    // Si hay un error, revertir la transacción
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
export const updateOrdenTrabajo = async (req, res) => {
    const { id_orden } = req.params;
    const result = ordenTrabajoSchema.safeParse(req.body);
  
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const {
      id_equipo,
      id_usuario,
      id_cliente,
      area,
      prioridad,
      descripcion,
      estado,
      fecha_prometida,
      presupuesto,
      adelanto,
      total,
      confirmacion,
      passwordequipo,
      imagenes,
    } = result.data;
  
    const transaction = await sequelize.transaction();
    await ProductoOrden.destroy({ where: { id_orden: id_orden }, transaction });
    await ServicioOrden.destroy({ where: { id_orden: id_orden }, transaction });
  
    try {
      // Encontrar la orden de trabajo
      const ordenExistente = await OrdenTrabajo.findByPk(id_orden, { transaction });
  
      if (!ordenExistente) {
        return res.status(404).json({ message: 'Orden de trabajo no encontrada' });
      }
  
      // Actualizar la orden de trabajo
      await ordenExistente.update({
        id_equipo,
        id_usuario,
        id_cliente,
        area,
        prioridad,
        descripcion,
        estado,
        fecha_prometida,
        presupuesto,
        adelanto,
        total,
        confirmacion,
        passwordequipo,
      }, { transaction });
  
      // Actualizar las imágenes asociadas (opcional)
      if (imagenes && imagenes.length > 0) {
        // Eliminar las imágenes existentes
        await ImagenOrden.destroy({ where: { id_orden }, transaction });
  
        // Crear las nuevas imágenes
        const imagenesData = imagenes.map(url => ({
          id_orden: id_orden,
          url_imagen: url,
        }));
  
        await ImagenOrden.bulkCreate(imagenesData, { transaction });
      }
  
      // Confirmar la transacción
      await transaction.commit();
  
      res.status(200).json({ message: 'Orden de trabajo actualizada exitosamente', orden: ordenExistente });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
};
export const deleteOrdenTrabajo = async (req, res) => {
    const { id_orden } = req.params;
  
    const transaction = await sequelize.transaction();
  
    try {
      // Encontrar la orden de trabajo
      const ordenExistente = await OrdenTrabajo.findByPk(id_orden, { transaction });
  
      if (!ordenExistente) {
        return res.status(404).json({ message: 'Orden de trabajo no encontrada' });
      }
  
      // Eliminar las imágenes asociadas
      await ImagenOrden.destroy({ where: { id_orden }, transaction });
  
      // Eliminar la orden de trabajo
      await OrdenTrabajo.destroy({ where: { id_orden }, transaction });
  
      // Confirmar la transacción
      await transaction.commit();
  
      res.status(200).json({ message: 'Orden de trabajo eliminada exitosamente' });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
};
  