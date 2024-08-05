import express from 'express';
import { login, logout} from '../controllers/authController.js';
import {checkAuth} from '../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/login', login);
router.get('/check-auth', checkAuth, (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
});
router.post('/logout', logout)

export default router;