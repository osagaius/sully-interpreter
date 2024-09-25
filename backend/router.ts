import express from 'express';
import { conversationsRouter } from './services';

const router = express.Router();

router.use('/hello-world', (_req, res) => res.send(200))
router.use('/conversations', conversationsRouter);

export default router;
