import { Router } from 'express';
import {
  getOperatorOverview,
  getOperatorBuses,
  createBus,
  getOperatorRoutes,
  createRoute,
  getOperatorTrips,
  createTrip,
  getPassengerManifest,
  reportDisruption,
  getAnalytics,
} from '../controllers/operatorController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Require operator or admin role for all operator routes
router.use(authenticate, requireRole(['OPERATOR', 'ADMIN']));

router.get('/overview', getOperatorOverview);
router.get('/buses', getOperatorBuses);
router.post('/buses', createBus);
router.get('/routes', getOperatorRoutes);
router.post('/routes', createRoute);
router.get('/trips', getOperatorTrips);
router.post('/trips', createTrip);
router.get('/manifest/:tripId', getPassengerManifest);
router.post('/trips/:tripId/disruption', reportDisruption);
router.get('/analytics', getAnalytics);

export default router;
