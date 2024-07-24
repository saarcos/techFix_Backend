import express from 'express';
import { login, protectedRoute } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/login', login);

router.get('/protected', authenticateToken, protectedRoute);
export default router;