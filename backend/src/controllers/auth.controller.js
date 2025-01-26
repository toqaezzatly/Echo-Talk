import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail} from "../lib/email.js";
import validator from 'validator';
import cloudinary from "../lib/cloudinary.js";
import { google } from 'googleapis'; // Import the Google API library
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
);

// Function to generate the Google Authorization URL
export const googleAuthUrl = async (req, res) => {
    const scopes = [
        'https://mail.gmail.com/', // Full access to Gmail
        'https://www.googleapis.com/auth/userinfo.email', // Access to user's email address
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'online' for just access token, 'offline' to get refresh token as well
        scope: scopes,
        prompt: 'consent', // Force consent screen to show every time
    });

    res.json({ url: authorizationUrl });
};

// Function to handle the OAuth2 Callback from Google
export const googleOauthCallback = async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // **IMPORTANT**: Store the refresh_token securely in your database,
        // associated with the user who authorized the application.
        // You'll use this refresh_token to get new access tokens later.
        const refreshToken = tokens.refresh_token;

        // Get user email from Gmail API.
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const userInfo = await gmail.users.getProfile({
            userId: 'me', // Use 'me' to refer to the authenticated user
        });

        const emailAddress = userInfo.data.emailAddress;

        // **Save or Retrieve the user from you DB with email and refresh token and googleId (optional)**
        // Here's a VERY simplified example. You'll need to adapt this to your actual database schema.
        let user = await User.findOne({ email: emailAddress }); // Or search by googleID

        if (!user) {
            // New User
            user = new User({
                email: emailAddress,
                googleId: userInfo.data.id,
                refreshToken: refreshToken, // Store the refresh token!
                isVerified: true,   // Trust google, and mark the user as verified as well.
                fullName: userInfo.data.emailAddress,  // or some other default value
                profilePic: "/avatar.png",
            });
            await user.save();
            generateToken(user._id, res);

        } else {
            // Existing user
            user.refreshToken = refreshToken // Update the refresh token if it's a new session or if you rotate refresh tokens
            user.googleId = userInfo.data.id  //make sure to set googleId
            await user.save();
            generateToken(user._id, res);

        }

        console.log("Refresh Token:", refreshToken); // **Log the refresh token!**
        // TODO send token
        res.send('Authentication successful! Check your database for the email and the refresh token!'); // or redirect to a success page
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.status(500).send('Authentication failed.');
    }
};


export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isStrongPassword(password,
            {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }
        )) {
            return res.status(400).json({ message: "Password is not strong enough, it must have at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: name,
            email,
            password: hashedPassword,
            profilePic: "/avatar.png",
        });

        if (newUser) {
            // generateToken(newUser._id, res); // Don't generate token here, do it after verification

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

            newUser.verificationToken = verificationToken;
            newUser.verificationTokenExpiresAt = verificationTokenExpiresAt;
            newUser.isVerified = false; // Make sure isVerified is false after creating the user
            await newUser.save();


            const emailSent = await sendVerificationEmail(newUser.email, verificationToken); // Await the sendVerificationEmail function
            if (!emailSent) {
                console.error("Error: Failed to send verification email")
                return res.status(500).json({ message: "Error sending verification email" });  // Return an error if email failed
            }

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                status: newUser.status,
                phone: newUser.phone,
                location: newUser.location,
                website: newUser.website,
                createdAt: newUser.createdAt,
                message: "Verification email sent. Please check your inbox." // Add message to inform the user to verify
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });
        if (user) {
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
            await user.save();

            generateToken(user._id, res); // Now generate token after successful verification

            const emailSent = await sendWelcomeEmail(user.email, user.fullName); // Await the sendWelcomeEmail function
            if (!emailSent) {
                console.error("Error: Failed to send welcome email");
                return res.status(500).json({ message: "Error sending welcome email" });  // Return an error if email failed
            }


            res.status(200).json({ message: "Email verified successfully" });


        } else {
            res.status(400).json({ message: "Invalid verification token" });
        }
    } catch (error) {
        console.log("Error in verifyEmail controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Login failed: User not found for email", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Login failed: Incorrect password for email", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }


        if (!user.isVerified) { // Remove fetching user again, as it's not necessary and can cause issues.
            console.log("Login blocked: User is not verified for email", email);
            return res.status(400).json({ message: "Email not verified" });
        }

        generateToken(user._id, res);
        user.lastLogin = Date.now();
        await user.save();
        const userFromDB = await User.findById(user._id);

        res.status(200).json({
            _id: userFromDB._id,
            fullName: userFromDB.fullName,
            email: userFromDB.email,
            profilePic: userFromDB.profilePic,
            status: userFromDB.status,
            phone: userFromDB.phone,
            location: userFromDB.location,
            website: userFromDB.website,
            createdAt: userFromDB.createdAt,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export const logout = async (req, res) => {
    try {
      // Clear HTTP-only cookie
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
      });
  
      // Optional: Clear any other cookies
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
      });
  
      // Send success response
      res.status(200).json({
        message: 'Logged out successfully'
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Error logging out',
        error: error.message
      });
    }
  };



export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { fullName, profilePic, status, phone, location, website } = req.body;
        console.log("updateProfile called with:", req.body)


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        const updates = {};

        if (fullName) updates.fullName = fullName;
        if (status) updates.status = status;

        // Explicitly set empty string if value is empty.
        updates.phone = phone === "" ? "" : phone;
        updates.location = location === "" ? "" : location;
        updates.website = website === "" ? "" : website;



        if (profilePic) {

            try {
                const uploadResponse = await cloudinary.uploader.upload(profilePic);
                updates.profilePic = uploadResponse.secure_url;

            } catch (uploadError) {
                console.error("Error during upload to cloudinary:", uploadError)
                return res.status(500).json({ message: "Error uploading profile picture", error: uploadError.message });
            }

        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("updateProfile updated user:", updatedUser)


        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
            status: updatedUser.status,
            phone: updatedUser.phone,
            location: updatedUser.location,
            website: updatedUser.website,
            createdAt: updatedUser.createdAt,
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const checkAuth = async (req, res) => {
    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized user" })
        }


        const user = await User.findById(req.user._id);


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            status: user.status,
            phone: user.phone,
            location: user.location,
            website: user.website,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refreshToken = async (req, res) => {
    const { userId } = req.body;  // Or extract user ID from headers/cookies if appropriate

    try {
        const user = await User.findById(userId);
        if (!user || !user.refreshToken) {
            return res.status(400).json({ message: "User not found or no refresh token" });
        }

        oauth2Client.setCredentials({
            refresh_token: user.refreshToken
        });

        const { tokens } = await oauth2Client.refreshAccessToken();
        const newAccessToken = tokens.access_token;

        // Optionally update the refresh token in the database if it's been rotated
        if (tokens.refresh_token) {
            user.refreshToken = tokens.refresh_token;
            await user.save();
        }

        res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        console.error("Error refreshing access token:", error);
        res.status(500).json({ message: "Error refreshing access token", error: error.message });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;
        
        // 1. Hash the incoming token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // 2. Fix field name to resetPasswordExpiresAt
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid or expired token' 
            });
        }

        // 3. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Update password and clear fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            message: 'Password reset successful'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Password reset failed',
            error: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        const successResponse = { message: "If an account exists, a reset link will be sent" };

        if (!user) return res.status(200).json(successResponse);

        // Generate token with SHA-256
        const resetToken = crypto.randomBytes(32).toString('hex'); // 32 bytes = 64 hex chars
        const resetTokenHash = crypto.createHash('sha256')
                                   .update(resetToken)
                                   .digest('hex');

        // Atomic update
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                resetPasswordToken: resetTokenHash,
                resetPasswordExpiresAt: Date.now() + 3600000 // 1 hour
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) throw new Error("Failed to update user record");

        try {
            // Encode for URL safety
            await sendPasswordResetEmail(
                user.email,
                encodeURIComponent(resetToken) // URL-safe encoding
            );
            
            return res.status(200).json(successResponse);
            
        } catch (emailError) {
            // Rollback on email failure
            await User.findByIdAndUpdate(user._id, {
                $unset: { resetPasswordToken: 1, resetPasswordExpiresAt: 1 }
            });
            
            console.error("Email failed:", emailError);
            return res.status(502).json({ 
                message: "Failed to send reset email. Please try again." 
            });
        }

    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({ 
            message: "An unexpected error occurred." 
        });
    }
};