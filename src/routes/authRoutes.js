import express from 'express';
import { login, protectedRoute   } from '../controllers/authController.js';
import {checkAuth} from '../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/login', login);
router.get('/check-auth', checkAuth);


router.get('/protected', checkAuth, protectedRoute);
export default router;