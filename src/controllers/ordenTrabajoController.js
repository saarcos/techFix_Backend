import { z } from 'zod';
import OrdenTrabajo from '../models/ordenTrabajoModel.js';
import ImagenOrden from '../models/imagenOrden.js';
import Equipo from '../models/equipoModel.js';
import Usuario from '../models/userModel.js';
import Cliente from '../models/clientModel.js';
import Marca from '../models/brandModel.js'
import Modelo from '../models/modelModel.js'
import sequelize from '../config/sequelize.js';
import AccesoriosDeOrden from '../models/accesorioOrdenModel.js';
import DetalleOrden from '../models/detalleOrdenModel.js';
import Producto from '../models/productModel.js';
import Servicio from '../models/serviceModel.js';

export const ordenTrabajoSchema = z.object({
  id_equipo: z.number().int().min(1, 'El ID del equipo es obligatorio'),
  id_usuario: z.number().int().nullable().optional(),
  cliente_id: z.number().int().min(1, 'El ID del cliente es obligatorio'),
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
              model: Modelo,  // Incluimos Modelo
              as: 'modelo',
              attributes: ['nombre'],  // Atributos del modelo
              include: [
                {
                  model: Marca,  // Incluimos Marca a través de Modelo
                  as: 'marca',
                  attributes: ['nombre'], // Atributos de la marca
                }
              ]
            },
            {
              model: Cliente,  // Incluimos Cliente a través del Equipo
              as: 'cliente',
              attributes: ['nombre', 'apellido', 'cedula', 'correo', 'celular'], // Ajusta los atributos según tu estructura
            }
          ],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'apellido', 'email'], // Ajusta estos atributos según tu estructura
        },
        {
          model: DetalleOrden, // Incluimos los detalles de la orden
          as: 'detalles',
          attributes: ['id_detalle', 'id_orden', 'id_usuario', 'id_servicio', 'id_producto', 'cantidad', 'precioservicio', 'precioproducto', 'cantidad', 'preciototal','status'],
        },
        {
          model: DetalleOrden,
          as: 'detalles',
          attributes: ['id_detalle', 'id_orden', 'id_usuario', 'id_servicio', 'id_producto', 'cantidad', 'precioservicio', 'precioproducto', 'cantidad', 'preciototal', 'status'],
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
              model: Modelo,  // Incluimos Modelo
              as: 'modelo',
              attributes: ['nombre'],  // Atributos del modelo
              include: [
                {
                  model: Marca,  // Incluimos Marca a través de Modelo
                  as: 'marca',
                  attributes: ['nombre'], // Atributos de la marca
                }
              ]
            },
            {
              model: Cliente,  // Incluimos Cliente a través del Equipo
              as: 'cliente',
              attributes: ['nombre', 'apellido', 'cedula', 'correo', 'celular'], // Ajusta los atributos según tu estructura
            }
          ],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'apellido', 'email'], // Ajusta estos atributos según tu estructura
        },
        {
          model: DetalleOrden,
          as: 'detalles',
          attributes: ['id_detalle', 'id_orden', 'id_usuario', 'id_servicio', 'id_producto', 'cantidad', 'precioservicio', 'precioproducto', 'cantidad', 'preciototal', 'status'],
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
export const getOrdenTrabajoByEquipoId = async (req, res) => {
  const { id_equipo } = req.params;
  try {
    // Buscar todas las órdenes de trabajo que correspondan al equipo dado
    const ordenes = await OrdenTrabajo.findAll({
      where: { id_equipo },  // Filtro por id_equipo
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
              model: Modelo,  // Incluimos Modelo
              as: 'modelo',
              attributes: ['nombre'],
              include: [
                {
                  model: Marca,  // Incluimos Marca a través de Modelo
                  as: 'marca',
                  attributes: ['nombre'],
                }
              ]
            },
            {
              model: Cliente,  // Incluimos Cliente a través del Equipo
              as: 'cliente',
              attributes: ['nombre', 'apellido', 'cedula', 'correo', 'celular'],
            }
          ],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'apellido', 'email'],
        },
        {
          model: DetalleOrden, // Incluimos los detalles de la orden
          as: 'detalles',
          attributes: ['id_detalle', 'id_orden', 'id_usuario', 'id_servicio', 'id_producto', 'cantidad', 'precioservicio', 'precioproducto', 'cantidad', 'preciototal','status'],
        },
        {
          model: DetalleOrden,
          as: 'detalles',
          attributes: ['id_detalle', 'id_orden', 'id_usuario', 'id_servicio', 'id_producto', 'cantidad', 'precioservicio', 'precioproducto', 'cantidad', 'preciototal', 'status'],
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
        }
      ]
    });

    // Si no se encuentran órdenes
    if (!ordenes || ordenes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron órdenes de trabajo para este equipo' });
    }

    // Enviar la respuesta con las órdenes encontradas
    res.status(200).json(ordenes);
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
    cliente_id,
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
      cliente_id,
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
    cliente_id,
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
  await DetalleOrden.destroy({ where: {id_orden}, transaction});
  await AccesoriosDeOrden.destroy({ where: { id_orden }, transaction });
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
      cliente_id,
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

    if (imagenes) {
      if (imagenes.length > 0) {
        // Obtener las imágenes actuales en la base de datos
        const existingImages = await ImagenOrden.findAll({ where: { id_orden }, transaction });

        // Filtrar las imágenes que se deben eliminar (no están en el array enviado)
        const imagesToDelete = existingImages.filter(img => !imagenes.includes(img.url_imagen));

        // Eliminar las imágenes que ya no están
        if (imagesToDelete.length > 0) {
          const urlsToDelete = imagesToDelete.map(img => img.url_imagen);
          await ImagenOrden.destroy({ where: { id_orden, url_imagen: urlsToDelete }, transaction });
        }

        // Filtrar las imágenes nuevas (URLs que no están en la base de datos)
        const newImages = imagenes.filter(url => !existingImages.some(img => img.url_imagen === url));

        // Insertar nuevas imágenes
        if (newImages.length > 0) {
          const imagenesData = newImages.map(url => ({
            id_orden: id_orden,
            url_imagen: url,
          }));
          await ImagenOrden.bulkCreate(imagenesData, { transaction });
        }
      } else {
        // Si el array de imágenes está vacío, eliminar todas las imágenes asociadas a la orden
        await ImagenOrden.destroy({ where: { id_orden }, transaction });
      }
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
