import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);


    } catch (error) {
        // Handle server errors
        console.error("getUsersForSidebar Error", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const getMessages = async (req, res) =>{
    try {
        const { id:userIdtoChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
             $or: [
                { senderId: myId, receiverId: userIdtoChatId },
                 { receiverId: userIdtoChatId, senderId: myId }] })
                 

        res.status(200).json(messages);

    } catch (error) {
        // Handle server errors
        console.error("getMessages Error", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id:recipientId } = req.params;
        const senderId = req.user._id;


        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;

        }

        const newMessage = await Message.create({
            senderId,
            receiverId: recipientId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
// Real time functionality goes here => socket.io

        res.status(201).json(newMessage);

    } catch (error) {
        // Handle server errors
        console.error("sendMessage controller Error", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


