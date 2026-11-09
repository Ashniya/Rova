import { Router } from 'express';
import {
  createBooking,
  getBookingByPNR,
  cancelBooking,
  getUserBookings,
} from '../controllers/bookingController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, createBooking);
router.get('/my-bookings', authenticate, getUserBookings);
router.get('/:pnr', getBookingByPNR);
router.post('/:pnr/cancel', optionalAuth, cancelBooking);

export default router;
