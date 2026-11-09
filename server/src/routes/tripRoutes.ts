import { Router } from 'express';
import { searchTrips, getTripById, getPopularLocations } from '../controllers/tripController';

const router = Router();

router.get('/locations', getPopularLocations);
router.get('/', searchTrips);
router.get('/:id', getTripById);

export default router;
