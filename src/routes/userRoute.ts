import { Router } from 'express';
import { getTopSpenders, createUser, createOrder } from '../controllers/userController';

const router = Router();

router.post('/user', createUser);
 router.get('/top-spenders', getTopSpenders);
router.post('/order', createOrder);


export default router;
