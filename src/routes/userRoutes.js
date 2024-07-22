import express from 'express';
import { getAllUsuarios, getUsuarioById } from '../controllers/userController.js';

const router = express.Router();

router.get('/usuarios', getAllUsuarios);
router.get('/usuarios/:id', getUsuarioById);

export default router;
