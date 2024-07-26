import express from 'express';
import { login, protectedRoute   } from '../controllers/authController.js';
import {checkAuth, logout} from '../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/login', login);
router.get('/check-auth', checkAuth);
router.get('/protected', checkAuth, protectedRoute);
router.post('/logout', logout)

export default router;