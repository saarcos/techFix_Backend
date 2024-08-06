import { Router } from 'express';
import { createModelo, getModelos, getModeloById, updateModelo, deleteModelo } from '../controllers/modelController.js';

const router = Router();

router.post('/modelos', createModelo);
router.get('/modelos', getModelos);
router.get('/modelos/:id', getModeloById);
router.put('/modelos/:id', updateModelo);
router.delete('/modelos/:id', deleteModelo);

export default router;
