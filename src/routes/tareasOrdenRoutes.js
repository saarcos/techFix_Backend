// routes/tareasOrdenRoutes.js
import { Router } from 'express';
import { asignarTareasAOrden, actualizarEstadoTareaOrden, obtenerTareasPorOrden, eliminarTareaDeOrden, actualizarTareaOrden } from '../controllers/tareasOrdenController.js';

const router = Router();

// Asignar tareas a una orden de trabajo
router.post('/tareasorden', asignarTareasAOrden);

// Actualizar el estado de una tarea en la orden
router.put('/tareasorden/:id_taskord', actualizarEstadoTareaOrden);

// Actualizar una tarea en la orden
router.patch('/tareasorden/:id_taskord', actualizarTareaOrden);

// Obtener tareas asignadas a una orden
router.get('/tareasorden/:id_orden', obtenerTareasPorOrden);

// Eliminar una tarea de una orden
router.delete('/tareasorden/:id_taskord', eliminarTareaDeOrden);

export default router;
