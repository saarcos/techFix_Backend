import express from 'express';
import { getAllRoles, getRoleById } from '../controllers/roleController.js';

const router = express.Router();

router.get('/roles', getAllRoles);
router.get('/roles/:id', getRoleById);

export default router;