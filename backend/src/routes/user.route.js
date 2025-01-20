// backend/src/routes/user.route.js
import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';
import { protectRoute} from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/profile/:userId', protectRoute, getUserProfile);

export default router;