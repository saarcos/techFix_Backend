import express from 'express';
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, updateUsuarioByTecnico} from '../controllers/userController.js';
import { checkAuth, authorizeAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/usuarios', checkAuth, getAllUsuarios);
router.get('/usuarios/:id', checkAuth, authorizeAdmin, getUsuarioById);
router.post('/usuarios',  createUsuario);
router.put('/usuarios/:id', checkAuth, authorizeAdmin, updateUsuario);
router.put('/usuarios/modificar-tecnico/:id', checkAuth, updateUsuarioByTecnico);
router.delete('/usuarios/:id', checkAuth, authorizeAdmin, deleteUsuario);

export default router;
