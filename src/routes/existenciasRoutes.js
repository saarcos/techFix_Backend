// routes/existenciasRoutes.js
import express from 'express';
import { 
  getExistencias,
  getExistenciaById,
  createExistencia,
  updateExistencia,
  deleteExistencia
} from '../controllers/existenciasController.js';

const router = express.Router();

// Ruta para obtener todas las existencias
router.get('/existencias', getExistencias);

// Ruta para obtener una existencia por ID
router.get('/existencias/:id_existencias', getExistenciaById);

// Ruta para crear una nueva existencia
router.post('/existencias', createExistencia);

// Ruta para actualizar una existencia
router.put('/existencias/:id_existencias', updateExistencia);

// Ruta para eliminar una existencia
router.delete('/existencias/:id_existencias', deleteExistencia);

export default router;
