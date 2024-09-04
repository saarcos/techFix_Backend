// routes/tareaRoutes.js
import { Router } from 'express';
import { 
    getAllTareas,
    createTarea, 
    getTareaById, 
    updateTarea, 
    deleteTarea, 
    addProductoToTarea, 
    addServicioToTarea,
    updateProductoInTarea, 
    updateServicioInTarea, 
    deleteProductoFromTarea, 
    deleteServicioFromTarea  } from '../controllers/tareaController.js';

const router = Router();

router.get('/tareas', getAllTareas);
router.post('/tareas', createTarea);
router.get('/tareas/:id', getTareaById);
router.put('/tareas/:id', updateTarea);
router.delete('/tareas/:id', deleteTarea);
router.post('/tareas/productos', addProductoToTarea);
router.post('/tareas/servicios', addServicioToTarea);
router.put('/tareas/productos/:id_taskprod', updateProductoInTarea);
router.put('/tareas/servicios/:id_taskserv', updateServicioInTarea);
router.delete('/tareas/productos/:id_taskprod', deleteProductoFromTarea);
router.delete('/tareas/servicios/:id_taskserv', deleteServicioFromTarea);

export default router;
