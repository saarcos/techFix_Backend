// routes/ordenTrabajoRoutes.js
import express from 'express';
import { 
    createOrdenTrabajo,
    getOrdenesTrabajo,
    updateOrdenTrabajo,
    deleteOrdenTrabajo
} from '../controllers/ordenTrabajoController.js';

const router = express.Router();

// Ruta para crear una nueva orden de trabajo
router.post('/ordenes', createOrdenTrabajo);
// Ruta para obtener todas las órdenes de trabajo
router.get('/ordenes', getOrdenesTrabajo);
// Ruta para actualizar una orden de trabajo por ID
router.put('/ordenes/:id_orden', updateOrdenTrabajo);
// Ruta para eliminar una orden de trabajo por ID
router.delete('/ordenes/:id_orden', deleteOrdenTrabajo);

export default router;
