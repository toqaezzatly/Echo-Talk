import express from 'express';
import {
    signup,
    login,
    logout,
    updateProfile,
    checkAuth,
    verifyEmail,
    forgotPassword,
    resetPassword,
    googleAuthUrl, // Import the new controller functions
    googleOauthCallback, // Import the new controller functions
    refreshToken  //Import the refresh token function
} from '../controllers/auth.controller.js';
import { protectRoute, verifyPasswordResetToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail); // Changed the route to match the frontend and common convention
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);

router.post(
    '/reset-password',
    verifyPasswordResetToken, // Add this middleware
    resetPassword
);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// OAuth 2.0 Routes
router.get('/google/authurl', googleAuthUrl);
router.get('/oauth2callback', googleOauthCallback);
router.post('/refresh-token', refreshToken); //Add refresh token route


export default router;