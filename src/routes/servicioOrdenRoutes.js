import express from 'express';
import {
    addServicesToOrder,
    getServicesFromOrder,
    updateServiceInOrder,
    removeServiceFromOrder
} from '../controllers/servicioOrdenController.js';

const router = express.Router();

router.post('/ordenes/:id_orden/servicios', addServicesToOrder); // Añadir varios servicios a la orden
router.get('/ordenes/:id_orden/servicios', getServicesFromOrder); // Obtener servicios de una orden
router.put('/serviciosorden/:id', updateServiceInOrder); // Actualizar un servicio en la orden
router.delete('/serviciosorden/:id', removeServiceFromOrder); // Eliminar un servicio de la orden

export default router;
