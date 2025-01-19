import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';
import { tokenValidator } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/profile/:userId', tokenValidator, getUserProfile);

export default router;