import mongoose from "mongoose";
import User from "./models/user.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined. Check your .env file and environment variables.");
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

// Function to delete all users
async function deleteAllUsers() {
    try {
        const result = await User.deleteMany({});
        console.log(`${result.deletedCount} users deleted`);
    } catch (error) {
        console.error("Error deleting users:", error);
    } finally {
        mongoose.connection.close(); // Close connection after operation
    }
}

// Call the function
deleteAllUsers();
