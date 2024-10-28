// routes/tareaOrdenRoutes.js
import { Router } from 'express';
import { getTareasFromOrder, updateTareaInOrder, removeTareaFromOrder, addTareasToOrder, getTareaFromOrderById } from '../controllers/tareaOrdenController.js';

const router = Router();

router.post('/tareasorden', addTareasToOrder);
router.get('/tareasorden/:id_orden', getTareasFromOrder);
router.get('/tareaorden/:id_tarea', getTareaFromOrderById);
router.put('/tareasorden/:id', updateTareaInOrder);
router.delete('/tareasorden/:id', removeTareaFromOrder);

export default router;
