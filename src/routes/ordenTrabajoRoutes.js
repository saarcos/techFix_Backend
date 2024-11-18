// routes/ordenTrabajoRoutes.js
import express from 'express';
import { 
    createOrdenTrabajo,
    getOrdenesTrabajo,
    updateOrdenTrabajo,
    deleteOrdenTrabajo,
    getOrdenTrabajoById,
    getOrdenTrabajoByEquipoId,
    moveOrdenTrabajo,
    getOrdenesMetrics,
    getGlobalMetrics,
    getRecurrentClients,
    getRecentOrders,
    getMonthlyEarnings,
} from '../controllers/ordenTrabajoController.js';

const router = express.Router();

// Ruta para crear una nueva orden de trabajo
router.post('/ordenes', createOrdenTrabajo);
// Ruta para obtener todas las órdenes de trabajo
router.get('/ordenes', getOrdenesTrabajo);
// Ruta para obtener las ganancias semanales y mensuales de las ordenes de trabajo.
router.get('/ordenes/metrics', getOrdenesMetrics)
// Ruta para obtener las ganancias totales y cantidad de órdenes procesadas en el taller.
router.get('/ordenes/globalMetrics', getGlobalMetrics)
// Ruta para obtener los clientes que han vuelto al taller
router.get('/ordenes/clientMetrics', getRecurrentClients)
// Ruta para obtener los clientes que han vuelto al taller
router.get('/ordenes/monthlyEarnings', getMonthlyEarnings)
// Ruta para obtener las 5 órdenes más recientes
router.get('/ordenes/recentOrders', getRecentOrders)
// Ruta para obtener una orden de trabajo por id.
router.get('/ordenes/:id_orden', getOrdenTrabajoById);
// Ruta para obtener todas las ordenes de trabajo en donde consta un equipo por su id.
router.get('/ordenes-equipo/:id_equipo', getOrdenTrabajoByEquipoId);
// Ruta para actualizar una orden de trabajo por ID
router.put('/ordenes/:id_orden', updateOrdenTrabajo);
// Ruta para actualizar el área de una orden de trabajo por id
router.put('/ordenes/mover/:id_orden', moveOrdenTrabajo);
// Ruta para eliminar una orden de trabajo por ID
router.delete('/ordenes/:id_orden', deleteOrdenTrabajo);


export default router;
