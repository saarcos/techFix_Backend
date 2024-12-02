import { Router } from 'express';
import { getNotificaciones, readNotificacion } from '../controllers/notificacionController.js';

const router = Router();

router.get('/notificaciones/:userId', getNotificaciones);
router.put('/notificaciones/:id_notificacion', readNotificacion)

export default router;
