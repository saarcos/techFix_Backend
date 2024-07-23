import express from 'express';
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario} from '../controllers/userController.js';

const router = express.Router();

router.get('/usuarios', getAllUsuarios);
router.get('/usuarios/:id', getUsuarioById);
router.post('/usuarios',createUsuario);
router.put('/usuarios/:id',updateUsuario);
router.delete('/usuarios/:id',deleteUsuario);

export default router;
