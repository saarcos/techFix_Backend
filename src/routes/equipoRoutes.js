import { Router } from 'express';
import { createEquipo, getEquipos, getEquipoById, updateEquipo, deleteEquipo, countRepairs } from '../controllers/equipoController.js';

const router = Router();

router.post('/equipos', createEquipo);
router.get('/equipos', getEquipos);
router.get('/equipos/count-repairs/:id_equipo', countRepairs);
router.get('/equipos/:id', getEquipoById);
router.put('/equipos/:id', updateEquipo);
router.delete('/equipos/:id', deleteEquipo);

export default router;
