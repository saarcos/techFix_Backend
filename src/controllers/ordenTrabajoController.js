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
import Accesorio from '../models/accesorioModel.js';

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
              attributes: ['id_cliente', 'nombre', 'apellido', 'cedula', 'correo', 'celular'], // Ajusta los atributos según tu estructura
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
              attributes: ['nombreProducto', 'preciofinal', 'preciosiniva', 'iva'],
            },
            {
              model: Servicio,
              as: 'servicio',
              attributes: ['nombre', 'preciofinal', 'preciosiniva', 'iva'],
            }
          ]
        },
        {
          model: AccesoriosDeOrden,
          as:'accesorios',
          attributes: ["id_accesorioord"],
          include: [
            {
              model: Accesorio,
              as: 'Accesorio',
              attributes: ['nombre']
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
          attributes: ['id_detalle', 'id_orden', 'id_usuario', 'id_servicio', 'id_producto', 'cantidad', 'precioservicio', 'precioproducto', 'cantidad', 'preciototal', 'status'],
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
  await DetalleOrden.destroy({ where: { id_orden }, transaction });
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
export const moveOrdenTrabajo = async (req, res) => {
  const { id_orden } = req.params;
  const { area, estado, id_usuario } = req.body;

  try {
    const ordenExistente = await OrdenTrabajo.findByPk(id_orden);

    if (!ordenExistente) {
      return res.status(404).json({ message: 'Orden de trabajo no encontrada' });
    }

    // Construye el objeto de actualización excluyendo id_usuario si es null
    const updateData = { area, estado };
    if (id_usuario !== null) {
      updateData.id_usuario = id_usuario;
    }

    await ordenExistente.update(updateData);

    res.status(200).json({ message: 'Área de la orden actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrdenesMetrics = async (req, res) => {
  try {
    const [weeklyData] = await sequelize.query(`
      WITH weekly_data AS (
        SELECT 
          date_part('week', "created_at") AS week_number,
          date_part('year', "created_at") AS year_number,
          SUM("total") AS weekly_earnings
        FROM "ordentrabajo"
        WHERE "created_at" >= (NOW() - interval '1 year') -- Todo en UTC
        GROUP BY week_number, year_number
      )
      SELECT 
        current_week.weekly_earnings AS current_week_earnings,
        COALESCE(
          ROUND(((current_week.weekly_earnings - COALESCE(previous_week.weekly_earnings, 0)) / NULLIF(previous_week.weekly_earnings, 0)) * 100, 2),
          0
        ) AS weekly_change
      FROM weekly_data AS current_week
      LEFT JOIN weekly_data AS previous_week
        ON current_week.week_number = previous_week.week_number + 1
        AND current_week.year_number = previous_week.year_number
      WHERE current_week.week_number = date_part('week', NOW()) -- Comparación en UTC
        AND current_week.year_number = date_part('year', NOW());
    `);

    const [monthlyData] = await sequelize.query(`
      WITH monthly_data AS (
        SELECT 
          date_part('month', "created_at") AS month_number,
          date_part('year', "created_at") AS year_number,
          SUM("total") AS monthly_earnings
        FROM "ordentrabajo"
        WHERE "created_at" >= (CURRENT_DATE - interval '1 year')
        GROUP BY month_number, year_number
      )
      SELECT 
        current_month.monthly_earnings AS current_month_earnings,
        COALESCE(
          ROUND(((current_month.monthly_earnings - previous_month.monthly_earnings) / NULLIF(previous_month.monthly_earnings, 0)) * 100, 2),
          0
        ) AS monthly_change
      FROM monthly_data AS current_month
      LEFT JOIN monthly_data AS previous_month
        ON current_month.month_number = previous_month.month_number + 1
        AND current_month.year_number = previous_month.year_number
      WHERE current_month.month_number = date_part('month', CURRENT_DATE)
        AND current_month.year_number = date_part('year', CURRENT_DATE);
    `);

    res.status(200).json({
      weekly: {
        earnings: weeklyData[0]?.current_week_earnings || 0,
        change: weeklyData[0]?.weekly_change || 0,
      },
      monthly: {
        earnings: monthlyData[0]?.current_month_earnings || 0,
        change: monthlyData[0]?.monthly_change || 0,
      },
    });
  } catch (error) {
    console.error('Error al calcular métricas del dashboard:', error);
    res.status(500).json({ error: 'Error al calcular métricas del dashboard' });
  }
};
export const getGlobalMetrics = async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT 
        COALESCE(SUM("total"), 0) AS "totalRecaudado",
        COUNT(*) AS "totalOrdenes"
      FROM "ordentrabajo"
      WHERE "total" IS NOT NULL
    `);

    const metrics = result[0];
    res.status(200).json({
      totalRecaudado: metrics.totalRecaudado,
      totalOrdenes: metrics.totalOrdenes,
    });
  } catch (error) {
    console.error('Error al obtener métricas globales:', error);
    res.status(500).json({ error: 'Error al obtener métricas globales' });
  }
};
export const getRecurrentClients = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      WITH total_clients AS (
          SELECT COUNT(DISTINCT cliente_id) AS total_clients
          FROM "ordentrabajo"
          WHERE cliente_id IS NOT NULL
      ),
      recurrent_clients AS (
          SELECT COUNT(DISTINCT cliente_id) AS recurrent_clients
          FROM "ordentrabajo"
          WHERE cliente_id IS NOT NULL
          GROUP BY cliente_id
          HAVING COUNT(id_orden) > 1
      )
      SELECT 
          COALESCE((SELECT total_clients FROM total_clients LIMIT 1), 0) AS total_clients,
          COALESCE((SELECT COUNT(*) FROM recurrent_clients), 0) AS recurrent_clients,
          COALESCE(
              ROUND(
                  (CAST((SELECT COUNT(*) FROM recurrent_clients) AS NUMERIC) / 
                  GREATEST(CAST((SELECT total_clients FROM total_clients LIMIT 1) AS NUMERIC), 1)) * 100, 
                  2
              ), 
              0
          ) AS percentage_recurrent;
    `);

    const {
      total_clients: totalClients = 0,
      recurrent_clients: recurrentClients = 0,
      percentage_recurrent: percentageRecurrent = 0
    } = results[0] || {};

    res.status(200).json({
      totalClients,
      recurrentClients,
      percentageRecurrent
    });
  } catch (error) {
    console.error('Error al obtener clientes recurrentes:', error.message);
    res.status(500).json({ error: 'Error al obtener clientes recurrentes' });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
          WITH recent_clients AS (
              SELECT 
                  c.id_cliente,
                  c.nombre,
                  c.apellido,
                  c.correo,
                  SUM(o.total) AS total_spent,
                  MAX(o.created_at) AS last_order_date
              FROM cliente c
              JOIN ordentrabajo o
                ON c.id_cliente = o.cliente_id
              WHERE o.created_at >= date_trunc('month', CURRENT_DATE)
              GROUP BY c.id_cliente, c.nombre, c.apellido, c.correo
              ORDER BY last_order_date DESC
              LIMIT 5
          ),
          orders_this_month AS (
              SELECT COUNT(*) AS total_orders
              FROM ordentrabajo
              WHERE created_at >= date_trunc('month', CURRENT_DATE)
          )
          SELECT 
              (SELECT json_agg(recent_clients) FROM recent_clients) AS recent_clients,
              (SELECT total_orders FROM orders_this_month) AS total_orders
      `);

    const { recent_clients, total_orders } = results[0];

    res.status(200).json({
      recentClients: recent_clients || [],
      totalOrders: total_orders || 0,
    });
  } catch (error) {
    console.error('Error al obtener métricas del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener métricas del dashboard' });
  }
};
export const getMonthlyEarnings = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SET lc_time = 'es_ES';
      WITH monthly_data AS (
        SELECT 
          date_trunc('month', "created_at") AS month,
          SUM("total") AS total_earnings
        FROM "ordentrabajo"
        WHERE "created_at" >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
        GROUP BY date_trunc('month', "created_at")
      )
      SELECT 
        TO_CHAR(month, 'TMMonth') AS month_label,
        COALESCE(total_earnings, 0) AS total_earnings
      FROM monthly_data
      ORDER BY month ASC;
    `);

    res.status(200).json({ monthlyEarnings: results });
  } catch (error) {
    console.error('Error al obtener ganancias mensuales:', error);
    res.status(500).json({ error: 'Error al obtener ganancias mensuales' });
  }
};


