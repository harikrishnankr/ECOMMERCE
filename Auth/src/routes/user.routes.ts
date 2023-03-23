import express from 'express';
import { getUserHandler } from '../controllers/buyer.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router.get('/details', getUserHandler);

export default router;
