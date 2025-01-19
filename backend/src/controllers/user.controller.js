import User from '../models/user.model.js';

export const getUserProfile = async (req, res) => {
  const { userId } = req.params; // Get the userId from the URL params
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user profile data (excluding the password)
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
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};