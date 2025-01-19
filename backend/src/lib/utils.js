import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    const secure = process.env.NODE_ENV === "production";
    const sameSite = process.env.NODE_ENV === "production" ? "strict" : "lax";

    console.log("Generated Token:", token);
    console.log("Cookie Settings:", {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: secure,
        sameSite: sameSite
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
       secure,
        sameSite,
    });

    return token;
};

export default generateToken;