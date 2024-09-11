// routes/plantillaRoutes.js
import { Router } from 'express';
import { createPlantilla, getAllPlantillas, updatePlantilla, asignarPlantillaAOrden, getPlantillaById, deletePlantilla } from '../controllers/plantillaController.js';

const router = Router();

router.get('/plantillas', getAllPlantillas);
router.get('/plantillas/:id_grupo', getPlantillaById);
router.post('/plantillas', createPlantilla);
router.post('/plantillas/asignar', asignarPlantillaAOrden);
router.put('/plantillas/:id_grupo', updatePlantilla);
router.delete('/plantillas/:id_grupo', deletePlantilla);

export default router;
