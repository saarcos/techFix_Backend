import sequelize from '../config/sequelize.js';
import Cliente from '../models/clientModel.js';
import { z } from 'zod';

const clienteSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no debe exceder 50 caracteres'),
    apellido: z.string().min(1, 'El apellido es obligatorio').max(100, 'El apellido no debe exceder 100 caracteres'),
    cedula: z.string().min(1, 'La cédula es obligatoria').max(13, 'La cédula no debe exceder 13 caracteres'),
    correo: z.string().email('Email inválido'),
    celular: z.string().min(10, 'El número de teléfono tiene 10 caracteres').max(10, 'El número de teléfono tiene 10 caracteres'),
    tipo_cliente: z.enum(['Persona', 'Empresa'], 'El tipo de cliente debe ser "Persona" o "Empresa"')
});

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    const result = clienteSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { cedula, correo, celular } = result.data;

    try {
        const existingCedula = await Cliente.findOne({ where: { cedula: cedula } });
        if (existingCedula) {
            return res.status(400).json({ error: 'Ya existe un cliente con esta cédula' });
        }

        if (correo) {
            const existingCorreo = await Cliente.findOne({ where: { correo: correo } });
            if (existingCorreo) {
                return res.status(400).json({ error: 'Ya existe un cliente con este correo' });
            }
        }

        if (celular) {
            const existingCelular = await Cliente.findOne({ where: { celular: celular } });
            if (existingCelular) {
                return res.status(400).json({ error: 'Ya existe un cliente con este número de celular' });
            }
        }

        const newClient = await Cliente.create(result.data);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los clientes
export const getClients = async (req, res) => {
    try {
        const clients = await Cliente.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un cliente por ID
export const getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Cliente.findByPk(id);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ error: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un cliente
export const updateClient = async (req, res) => {
    const { id } = req.params;
    const result = clienteSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }
    try {
        const client = await Cliente.findByPk(id);
        if (client) {
            await client.update(result.data);
            res.status(200).json(client);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un cliente
export const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Cliente.findByPk(id);
        if (client) {
            await client.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getNewClientsThisMonth = async (req, res) => {
    try {
        const [results] = await sequelize.query(`
            WITH current_month AS (
                SELECT COUNT(*) AS total
                FROM "cliente"
                WHERE "created_at" >= date_trunc('month', CURRENT_DATE)
                AND "created_at" < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')
            ),
            previous_month AS (
                SELECT COUNT(*) AS total
                FROM "cliente"
                WHERE "created_at" >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                AND "created_at" < date_trunc('month', CURRENT_DATE)
            )
            SELECT 
                COALESCE(current_month.total, 0) AS current_month_total,
                COALESCE(previous_month.total, 0) AS previous_month_total,
                CASE 
                    WHEN COALESCE(previous_month.total, 0) = 0 THEN 0
                    ELSE ROUND(
                        ((CAST(current_month.total AS NUMERIC) - CAST(previous_month.total AS NUMERIC)) 
                        / GREATEST(CAST(previous_month.total AS NUMERIC), 1)) * 100, 2
                    )
                END AS percentage_change
            FROM current_month, previous_month;
        `);
        const { current_month_total, previous_month_total, percentage_change } = results[0];

        res.status(200).json({
            newClients: current_month_total,
            percentageChange: percentage_change,
            previousMonthClients: previous_month_total,
        });
    } catch (error) {
        console.error('Error al obtener nuevos clientes del mes:', error);
        res.status(500).json({ error: 'Error al obtener nuevos clientes del mes' });
    }
};


