import Equipo from '../models/equipoModel.js';
import Cliente from '../models/clientModel.js';
import Marca from '../models/brandModel.js';
import Modelo from '../models/modelModel.js';
import { z } from 'zod';
import TipoEquipo from '../models/tipoEquipoModel.js';
import OrdenTrabajo from '../models/ordenTrabajoModel.js'
import { Op } from 'sequelize';

export const equipoSchema = z.object({
  id_cliente: z.number().int().positive('El ID del cliente debe ser un número positivo'),
  id_tipoe: z.number().int().positive('El ID del tipo de equipo debe ser un número positivo'),
  marca_id: z.number().int().positive('El ID de la marca debe ser un número positivo'),
  id_modelo: z.number().int().positive('El ID del modelo debe ser un número positivo'),
  nserie: z
  .string()
  .optional()
  .refine(
    (val) => !val || (val.length >= 5 && val.length <= 20),
    { message: 'El número de serie debe tener entre 5 y 20 caracteres si se proporciona' }
  ),
  descripcion: z.string().optional()
});

// Crear un nuevo equipo
export const createEquipo = async (req, res) => {
  const result = equipoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { id_cliente, id_tipoe, marca_id, id_modelo, nserie, descripcion } = result.data;

  try {
    // Verifica si nserie no es undefined o null antes de buscarlo
    if (nserie) {
      const existingNserie = await Equipo.findOne({ where: { nserie: nserie } });
      if (existingNserie) {
        return res.status(400).json({ error: 'Ya existe un equipo con ese número de serie' });
      }
    }

    // Crea el nuevo equipo sin problemas
    const newEquipo = await Equipo.create({ id_cliente, id_tipoe, marca_id, id_modelo, nserie, descripcion });
    res.status(201).json(newEquipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Obtener todos los equipos
export const getEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido']
        },
        {
          model: TipoEquipo,
          as: 'tipoEquipo',
          attributes: ['nombre']
        },
        {
          model: Modelo,
          as: 'modelo',
          include: [  // Incluir la relación entre Modelo y Marca
            {
              model: Marca,
              as: 'marca',  // Asignar alias a la Marca
              attributes: ['nombre']  // Traer el nombre de la Marca
            }
          ],
          attributes: ['nombre']  // Traer el nombre del Modelo
        }
      ]
    });
    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener un equipo por ID
export const getEquipoById = async (req, res) => {
  const { id } = req.params;
  try {
    const equipo = await Equipo.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['nombre', 'apellido']
        },
        {
          model: TipoEquipo,
          as: 'tipoEquipo',
          attributes: ['nombre']
        },
        {
          model: Modelo,
          as: 'modelo',
          include: [  
            {
              model: Marca,
              as: 'marca',  
              attributes: ['nombre']  
            }
          ],
          attributes: ['nombre']  
        }
      ]
    });
    if (equipo) {
      res.status(200).json(equipo);
    } else {
      res.status(404).json({ error: 'Equipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un equipo
export const updateEquipo = async (req, res) => {
  const { id } = req.params;
  const result = equipoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { id_cliente, id_tipoe, marca_id, id_modelo, nserie, descripcion } = result.data;

  try {
    const equipo = await Equipo.findByPk(id);
    if (equipo) {
      if (equipo.nserie) {
        const existingNserie = await Equipo.findOne({
            where: { nserie, id_equipo: { [Op.ne]: id } }
        });
        if (existingNserie) {
            return res.status(400).json({ error: 'Ya existe un equipo con ese número de serie' });
        }
      }
      await equipo.update({ id_cliente, id_tipoe, marca_id, id_modelo, nserie, descripcion });
      res.status(200).json(equipo);
    } else {
      res.status(404).json({ error: 'Equipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un equipo
export const deleteEquipo = async (req, res) => {
  const { id } = req.params;
  try {
    const equipo = await Equipo.findByPk(id);
    if (equipo) {
      await equipo.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Equipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Contar las reparaciones de un equipo
export const countRepairs = async (req, res) => {
  const { id_equipo } = req.params;
  try {
    const equipo = await Equipo.findOne({ where: { id_equipo: id_equipo } });

    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    const repairCount = await OrdenTrabajo.count({
      where: {
        id_equipo: equipo.id_equipo
      }
    });

    res.status(200).json({ repairCount });
  } catch (error) {
    console.error('Error al contar reparaciones:', error);
    res.status(500).json({ error: 'Error al contar reparaciones' });
  }
};
