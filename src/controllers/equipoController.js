import Equipo from '../models/equipoModel.js';
import Cliente from '../models/clientModel.js';
import Marca from '../models/brandModel.js';
import Modelo from '../models/modelModel.js';
import { z } from 'zod';
import TipoEquipo from '../models/tipoEquipoModel.js';
import OrdenTrabajo from '../models/ordenTrabajo.js'

export const equipoSchema = z.object({
  id_cliente: z.number().int().positive('El ID del cliente debe ser un número positivo'),
  id_tipoe: z.number().int().positive('El ID del tipo de equipo debe ser un número positivo'),
  marca_id: z.number().int().positive('El ID de la marca debe ser un número positivo'),
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

  const { id_cliente, id_tipoe, marca_id, id_modelo, nserie, descripcion } = result.data;

  try {
    const existingNserie = await Equipo.findOne({ where: { nserie: nserie } });
    if (existingNserie) {
      return res.status(400).json({ error: 'Ya existe un equipo con ese número de serie' });
    }
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
// Generar el serial del equipo (POST)
export const countEquipos = async (req, res) => {
  const { id_tipoe, marca_id, id_modelo } = req.body;  // Cambia req.query a req.body

  // Convertir los parámetros a enteros
  const id_tipoe_num = parseInt(id_tipoe, 10);
  const marca_id_num = parseInt(marca_id, 10);
  const id_modelo_num = parseInt(id_modelo, 10);


  // Validar que los parámetros sean números
  if (isNaN(id_tipoe_num) || isNaN(marca_id_num) || isNaN(id_modelo_num)) {
    return res.status(400).json({ error: 'Los parámetros deben ser números enteros válidos.' });
  }

  try {
    // Contar cuántos equipos existen con ese tipo, marca y modelo
    const total = await Equipo.count({
      where: {
        id_tipoe: id_tipoe_num,
        marca_id: marca_id_num,
        id_modelo: id_modelo_num
      }
    });

    // Incrementamos el total para obtener el siguiente número secuencial
    const nextSequential = (total + 1).toString().padStart(3, '0');

    // Devolvemos el número secuencial generado
    res.json({ nextSequential });
  } catch (error) {
    console.error('Error al generar el número de serie:', error);
    res.status(500).json({ error: 'Error al generar el número de serie' });
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
