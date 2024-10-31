import express from 'express';
import { getEventByUserId, updateEventByUserId, deleteEventByUserId } from '../controllers/events.js';

const router = express.Router();

router.route('/user/:userId').get(getEventByUserId).put(updateEventByUserId).delete(deleteEventByUserId);

export default router;
