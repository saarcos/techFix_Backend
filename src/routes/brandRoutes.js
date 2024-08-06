import { Router } from 'express';
import { createMarca, getMarcas, getMarcaById, updateMarca, deleteMarca } from '../controllers/brandController.js';

const router = Router();

router.post('/marcas', createMarca);
router.get('/marcas', getMarcas);
router.get('/marcas/:id', getMarcaById);
router.put('/marcas/:id', updateMarca);
router.delete('/marcas/:id', deleteMarca);

export default router;
