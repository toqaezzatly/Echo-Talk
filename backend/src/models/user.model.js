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
    },
    status: {
        type: String,
        default: "Hey. I am using Echo-Talk!",
    },
    phone: {
        type: String,
    },
    location: {
        type: String,
    },
    website: {
        type: String,
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
