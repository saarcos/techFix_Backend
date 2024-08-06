import express from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient } from '../controllers/clientController.js';
const router = express.Router();
router.post('/clientes', createClient);
router.get('/clientes', getClients);
router.get('/clientes/:id', getClientById);
router.put('/clientes/:id', updateClient);
router.delete('/clientes/:id', deleteClient);

export default router;

