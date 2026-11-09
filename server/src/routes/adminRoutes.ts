import { Router } from 'express';
import { getAuditLogs, getSystemStats, getAllUsers } from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole(['ADMIN']));

router.get('/stats', getSystemStats);
router.get('/audit-logs', getAuditLogs);
router.get('/users', getAllUsers);

export default router;
