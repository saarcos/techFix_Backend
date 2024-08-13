import { Router } from 'express';
import { createBrandAndModel } from '../controllers/brandModelController.js';

const router = Router();

router.post('/brand-model', createBrandAndModel);

export default router;
