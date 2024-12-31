import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();


router.post("/signup", signup);

router.get("/login", (req, res) => {
    res.send("login")
}).post("/login", login);

router.get("/logout", (req, res) => {
    res.send("logout")
}).post("/logout", logout);

router.put("/update-profile",protectRoute, updateProfile);

router.get("/check",protectRoute, checkAuth);


export default router;