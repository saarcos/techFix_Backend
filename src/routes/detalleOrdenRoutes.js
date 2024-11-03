// routes/detalleOrdenRoutes.js
import express from 'express';
import { 
  getDetallesOrden, 
  updateDetalleOrden, 
  deleteDetalleOrden, 
  getDetallesByOrdenId,
  createDetallesOrden
} from '../controllers/detalleOrdenController.js';

const router = express.Router();

// Ruta para crear un nuevo detalle de orden con verificación de stock
router.post('/detalleorden', createDetallesOrden);

// Ruta para obtener todos los detalles de orden
router.get('/detalleorden', getDetallesOrden);

// Ruta para obtener un detalle de orden por ID
router.get('/detalleorden/:id_orden', getDetallesByOrdenId);

// Ruta para actualizar un detalle de orden
router.put('/detalleorden/:id_detalle', updateDetalleOrden);

// Ruta para eliminar un detalle de orden
router.delete('/detalleorden/:id_detalle', deleteDetalleOrden);

export default router;
