// routes/categoriasServicio.js
import { Router } from 'express';
import { getAllCategorias, createCategoria, getCategoriaById, updateCategoria, deleteCategoria } from '../controllers/serviceCategoryController.js';

const router = Router();

router.get('/serviceCategories', getAllCategorias);
router.post('/serviceCategories', createCategoria);
router.get('/serviceCategories/:id', getCategoriaById);
router.put('/serviceCategories/:id', updateCategoria);
router.delete('/serviceCategories/:id', deleteCategoria);

export default router;
