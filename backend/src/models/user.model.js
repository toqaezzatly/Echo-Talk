// backend/src/models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
    },
    password: {
        type: String,
        minLength: 6,
    },
    profilePic: {
        type: String,
        default: "/avatar.png",
    },
    status: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    website: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpiresAt: {
        type: Date,
        default: null,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiresAt: {
        type: Date,
    },
    googleId: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
,
    resetPasswordToken: {
        type: String,
        default: null // Add default value
    },
    resetPasswordExpiresAt: {
        type: Date,
        default: null // Add default value
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;