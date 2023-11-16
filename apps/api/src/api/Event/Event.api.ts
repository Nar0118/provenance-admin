import { Router } from 'express';
import {
  requireAuth,
  requireAuthAdmin,
} from '../../middleware/auth.middleware';
import {
  getAllEvents,
  getEventById,
  registerEvent,
  updateEvent,
  deleteEvent,
} from './Event.api.handlers';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', registerEvent);
router.put('/:id', requireAuth, updateEvent);
router.delete('/:id', requireAuthAdmin, deleteEvent);

export default router;
