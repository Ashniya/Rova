import { Router } from 'express';
import { register, login, getMe, handleSeed } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.all('/seed', handleSeed);

export default router;
