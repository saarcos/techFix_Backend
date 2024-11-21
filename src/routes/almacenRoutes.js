// routes/almacenRoutes.js
import express from 'express';
import { 
  getAlmacenes,
  getAlmacenById,
  createAlmacen,
  updateAlmacen,
  deleteAlmacen,
  getProductosConStock,
} from '../controllers/almacenController.js';

const router = express.Router();

// Ruta para obtener los productos con stock disponible
router.get('/almacenes/productosDisponibles', getProductosConStock)

// Ruta para obtener todos los almacenes
router.get('/almacenes', getAlmacenes);

// Ruta para obtener un almacén por ID
router.get('/almacenes/:id_almacen', getAlmacenById);

// Ruta para crear un nuevo almacén
router.post('/almacenes', createAlmacen);

// Ruta para actualizar un almacén
router.put('/almacenes/:id_almacen', updateAlmacen);

// Ruta para eliminar un almacén
router.delete('/almacenes/:id_almacen', deleteAlmacen);

export default router;
