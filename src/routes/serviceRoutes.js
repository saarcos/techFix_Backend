// routes/serviceRoutes.js
import { Router } from 'express';
import { getAllServicios, createServicio, getServicioById, updateServicio, deleteServicio } from '../controllers/serviceController.js';

const router = Router();

router.get('/servicios', getAllServicios);
router.post('/servicios', createServicio);
router.get('/servicios/:id', getServicioById);
router.put('/servicios/:id', updateServicio);
router.delete('/servicios/:id', deleteServicio);

export default router;
