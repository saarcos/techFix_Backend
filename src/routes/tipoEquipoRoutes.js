import { Router } from 'express';
import { createTipoEquipo, getTiposEquipo, getTipoEquipoById, updateTipoEquipo, deleteTipoEquipo } from '../controllers/tipoEquipoController.js';

const router = Router();

router.post('/tiposequipos', createTipoEquipo);
router.get('/tiposequipos', getTiposEquipo);
router.get('/tiposequipos/:id', getTipoEquipoById);
router.put('/tiposequipos/:id', updateTipoEquipo);
router.delete('/tiposequipos/:id', deleteTipoEquipo);

export default router;
