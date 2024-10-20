import { Router } from 'express';
import { createEquipo, getEquipos, getEquipoById, updateEquipo, deleteEquipo, countEquipos } from '../controllers/equipoController.js';

const router = Router();

router.post('/equipos', createEquipo);
router.post('/equipos/generar-numero-serie', countEquipos);  // Cambiado a POST
router.get('/equipos', getEquipos);
router.get('/equipos/:id', getEquipoById);
router.put('/equipos/:id', updateEquipo);
router.delete('/equipos/:id', deleteEquipo);

export default router;
