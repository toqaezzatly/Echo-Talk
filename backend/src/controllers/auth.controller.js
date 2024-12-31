import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if the password is valid
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        // Generate a token and send a response
        generateToken(newUser._id, res);
        res.status(201).json({
            fullName: newUser.fullName,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
        });
    } catch (error) {
        // Handle server errors
        console.error("Error in user controller:", error);
        res.status(500).json({ message: "Server error in user controller" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body; 

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        generateToken(user._id, res);
        res.status(200).json({
            fullName: user.fullName,            
            email: user.email,
            profilePicture: user.profilePicture,
        });

    } catch (error) {
        // Handle server errors
        console.error("Error in user login controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};


export const logout = async (req, res) => {

    try {
        res.clearCookie("jwt");
        
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        // Handle server errors
        console.error("Error in user logout controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 

export const updateProfile = async (req, res) => {

    try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    if(!profilePicture){
        return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: uploadResponse.secure_url },
        { new: true }
    );

    res.status(200).json({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
    });



  
    } catch (error) {
        // Handle server errors
        console.error("Error in user logout controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({ message: "Authenticated" });
    } catch (error) {
        // Handle server errors
        console.error("Error in user logout controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};