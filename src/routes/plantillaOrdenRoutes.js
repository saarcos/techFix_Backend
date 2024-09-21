// routes/plantillaOrdenRoutes.js
import { Router } from 'express';
import { getAllPlantillasOrden, deletePlantillaOrden, createMultiplePlantillasOrden, getPlantillasByOrden } from '../controllers/plantillaOrdenController.js';

const router = Router();


// Ruta para asignar múltiples plantillas a una orden
router.post('/plantillaOrden/multiple', createMultiplePlantillasOrden);

// Obtener todas las relaciones entre plantillas y órdenes
router.get('/plantillaOrden', getAllPlantillasOrden);

// Ruta para obtener las plantillas asignadas a una orden
router.get('/plantillaOrden/:id_orden', getPlantillasByOrden);

// Eliminar una relación entre plantilla y orden por su ID
router.delete('/plantillaOrden/:id_plantillaorden', deletePlantillaOrden);

export default router;
