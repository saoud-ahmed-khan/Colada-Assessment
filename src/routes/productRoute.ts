import { Router } from 'express';
import { getProductDemand } from '../controllers/productController';

const router = Router();

router.get('/demand-analysis', getProductDemand);

export default router;
