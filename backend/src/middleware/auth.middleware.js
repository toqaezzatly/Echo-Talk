// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import crypto from "crypto";

export const protectRoute = async (req, res, next) => {
    try {
    const token = req.cookies.jwt;
        if(!token){
        return res.status(401).json({message:"Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
        return res.status(401).json({message:"Unauthorized, Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
    req.user = user;
    next();

} catch(error) {
    console.log("Error in protectRoute middleware", error.message)
    res.status(500).json({message: "Internal Server Error"})
}
};


// backend/src/middleware/auth.middleware.js
export const verifyPasswordResetToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: "Missing reset token" });
        }

        // Hash the token
        const hashedToken = crypto.createHash('sha256')
                                .update(token)
                                .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({ message: "Token verification failed" });
    }
};