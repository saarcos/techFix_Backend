// routes/plantillaRoutes.js
import { Router } from 'express';
import { createPlantilla, getAllPlantillas, updatePlantilla, removeTareaFromPlantilla, asignarPlantillaAOrden } from '../controllers/plantillaController.js';

const router = Router();

router.get('/plantillas', getAllPlantillas);
router.post('/plantillas', createPlantilla);
router.post('/plantillas/asignar', asignarPlantillaAOrden);
router.put('/plantillas/:id_grupo', updatePlantilla);
router.delete('/plantillas/tareas/:id_taskgroup', removeTareaFromPlantilla);

export default router;
