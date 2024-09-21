import express from 'express';
import { addProductsToOrder, getProductsFromOrder, updateProductInOrder, removeProductFromOrder } from '../controllers/productoOrdenController.js';

const router = express.Router();

router.post('/ordenes/:id_orden/productos', addProductsToOrder); // Actualizamos para aceptar varios productos
router.get('/ordenes/:id_orden/productos', getProductsFromOrder);
router.put('/productosorden/:id', updateProductInOrder);
router.delete('/productosorden/:id', removeProductFromOrder);

export default router;
