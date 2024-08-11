import Equipo from '../models/equipoModel.js';
import Cliente from '../models/clientModel.js';
import Marca from '../models/brandModel.js';
import Modelo from '../models/modelModel.js';
import { z } from 'zod';
import TipoEquipo from '../models/tipoEquipoModel.js';

export const equipoSchema = z.object({
  id_cliente: z.number().int().positive('El ID del cliente debe ser un número positivo'),
  id_tipoe: z.number().int().positive('El ID del tipo de equipo debe ser un número positivo'),
  id_marca: z.number().int().positive('El ID de la marca debe ser un número positivo'),
  id_modelo: z.number().int().positive('El ID del modelo debe ser un número positivo'),
  nserie: z.string().min(1, 'El número de serie es obligatorio').max(100, 'El número de serie no debe exceder 100 caracteres'),
  descripcion: z.string().optional()
});

// Crear un nuevo equipo
export const createEquipo = async (req, res) => {
    const result = equipoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
  
    const { id_cliente, id_tipoe, id_marca, id_modelo, nserie, descripcion } = result.data;
  
    try {
        const existingNserie = await Equipo.findOne({ where: { nserie: nserie } });
        if (existingNserie) {
            return res.status(400).json({ error: 'Ya existe un equipo con ese número de serie' });
        }
        const newEquipo = await Equipo.create({ id_cliente,  id_tipoe, id_marca,  id_modelo,  nserie, descripcion });
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
            model: Marca,
            as: 'marca',
            attributes: ['nombre']
          },
          {
            model: Modelo,
            as: 'modelo',
            attributes: ['nombre']
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
            model: Marca,
            as: 'marca',
            attributes: ['nombre']
          },
          {
            model: Modelo,
            as: 'modelo',
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
  
    const { id_cliente, id_tipoe, id_marca, id_modelo, nserie, descripcion } = result.data;
  
    try {
        const equipo = await Equipo.findByPk(id);
        if (equipo) {
            await equipo.update({ id_cliente, id_tipoe,  id_marca,  id_modelo, nserie, descripcion });
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

