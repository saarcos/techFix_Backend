import express from 'express';
import { createAccesorio, getAccesorios, updateAccesorio, deleteAccesorio, getAccesorioById } from '../controllers/accesorioController.js';
import { addAccesorioToOrden, getAccesoriosByOrden, deleteAccesorioFromOrden } from '../controllers/accesorioOrdenController.js';

const router = express.Router();

// Rutas para ACCESORIO
router.post('/accesorios', createAccesorio);
router.get('/accesorios', getAccesorios);
router.get('/accesorios/:id_accesorio', getAccesorioById);
router.put('/accesorios/:id_accesorio', updateAccesorio);
router.delete('/accesorios/:id_accesorio', deleteAccesorio);

// Rutas para ACCESORIOSDEORDEN
router.post('/accesorios-orden', addAccesorioToOrden);
router.get('/accesorios-orden/:id_orden', getAccesoriosByOrden);
router.delete('/accesorios-orden/:id_accesorioord', deleteAccesorioFromOrden);

export default router;
