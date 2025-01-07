import Jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify and decode the token
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user by decoded userId
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        // Attach the user object to the request for further use
        req.user = user;
        next();

    } catch (error) {
        console.error("Error in auth middleware:", error);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        }

        // Catch any other errors
        return res.status(500).json({ message: "Internal server error" });
    }
};
