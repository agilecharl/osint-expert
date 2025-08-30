import express, { Router } from 'express';
import { getMessageCount } from '../controllers/messagesController';

const router = Router();
router.use(express.json());

router.get('/messages/count', getMessageCount);

export default router;
