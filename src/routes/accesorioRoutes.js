import express from 'express';
import { createAccesorio, getAccesorios, updateAccesorio, deleteAccesorio, getAccesorioById } from '../controllers/accesorioController.js';
import { getAccesoriosByOrden, deleteAccesorioFromOrden, addAccesoriosToOrden, updateAccesoriosOrden } from '../controllers/accesorioOrdenController.js';

const router = express.Router();

// Rutas para ACCESORIO
router.post('/accesorios', createAccesorio);
router.get('/accesorios', getAccesorios);
router.get('/accesorios/:id_accesorio', getAccesorioById);
router.put('/accesorios/:id_accesorio', updateAccesorio);
router.delete('/accesorios/:id_accesorio', deleteAccesorio);

// Rutas para ACCESORIOSDEORDEN
router.post('/accesorios-orden', addAccesoriosToOrden);
router.get('/accesorios-orden/:id_orden', getAccesoriosByOrden);
router.put('/accesorios-orden/:id_orden', updateAccesoriosOrden);
router.delete('/accesorios-orden/:id_accesorioord', deleteAccesorioFromOrden);

export default router;
