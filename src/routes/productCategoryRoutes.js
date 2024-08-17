// routes/categoriasProducto.js
import { Router } from 'express';
import { getAllCategorias, createCategoria, getCategoriaById, updateCategoria, deleteCategoria } from '../controllers/productCategoryController.js';

const router = Router();

router.get('/productCategories', getAllCategorias);
router.post('/productCategories', createCategoria);
router.get('/productCategories/:id', getCategoriaById);
router.put('/productCategories/:id', updateCategoria);
router.delete('/productCategories/:id', deleteCategoria);

export default router;
