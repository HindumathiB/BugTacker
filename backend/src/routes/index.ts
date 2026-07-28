import { Router } from 'express';
import authRoutes from './auth.routes';
import bugRoutes from './bug.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bugs', bugRoutes);

export default router;
