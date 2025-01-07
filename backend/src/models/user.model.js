import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 12,
        maxLength: 64,
    },
    profilePic: {
        type: String,
         //Removed the default value from the schema
    }}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;