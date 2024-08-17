// routes/productRoutes.js
import { Router } from 'express';
import { getAllProductos, createProducto, getProductoById, updateProducto, deleteProducto } from '../controllers/productController.js';

const router = Router();

router.get('/productos', getAllProductos);
router.post('/productos', createProducto);
router.get('/productos/:id', getProductoById);
router.put('/productos/:id', updateProducto);
router.delete('/productos/:id', deleteProducto);

export default router;
