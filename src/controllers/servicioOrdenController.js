import { z } from 'zod';
import ServicioOrden from '../models/servicioOrdenModel.js';
import Servicio from '../models/serviceModel.js'; // Asegúrate de importar el modelo de Servicio

const serviceSchema = z.object({
    id_servicio: z.number().int().positive('El id del servicio debe ser un número positivo'),
});

const servicioOrdenSchema = z.object({
    id_orden: z.number().int().positive('El id de la orden debe ser un número positivo'),
    servicios: z.array(serviceSchema) // Un array de servicios
});

// Añadir varios servicios a una orden
export const addServicesToOrder = async (req, res) => {
    const result = servicioOrdenSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const { id_orden, servicios } = result.data;

    try {
        const servicesToAdd = [];

        for (const { id_servicio } of servicios) {
            const service = await Servicio.findByPk(id_servicio);

            // Verificamos que el servicio exista
            if (!service) {
                return res.status(404).json({ error: `Servicio con id ${id_servicio} no encontrado` });
            }

            // Añadimos el servicio a la orden
            servicesToAdd.push({
                id_servicio,
                id_orden,
            });
        }

        // Insertamos los servicios en la tabla de servicios de la orden
        const newServiceOrders = await ServicioOrden.bulkCreate(servicesToAdd);
        res.status(201).json(newServiceOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los servicios de una orden
export const getServicesFromOrder = async (req, res) => {
    const { id_orden } = req.params;
    try {
        const services = await ServicioOrden.findAll({ where: { id_orden } });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un servicio en una orden
export const updateServiceInOrder = async (req, res) => {
    const { id } = req.params;
    const { id_servicio } = req.body; // Actualización solo del id_servicio

    try {
        const serviceOrder = await ServicioOrden.findByPk(id);

        if (!serviceOrder) {
            return res.status(404).json({ error: 'Servicio en la orden no encontrado' });
        }

        const service = await Servicio.findByPk(id_servicio);
        if (!service) {
            return res.status(404).json({ error: `Servicio con id ${id_servicio} no encontrado` });
        }

        // Actualizar el servicio en la orden
        await serviceOrder.update({
            id_servicio
        });

        res.status(200).json(serviceOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un servicio de una orden
export const removeServiceFromOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const serviceOrder = await ServicioOrden.findByPk(id);

        if (!serviceOrder) {
            return res.status(404).json({ error: 'Servicio en la orden no encontrado' });
        }

        // Eliminar el servicio de la orden
        await serviceOrder.destroy();
        res.status(204).json(); // No hay contenido al eliminar
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};