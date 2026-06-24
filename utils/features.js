import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {

    // BUG #6 FIX: Increased from 15m to 7d — prevents unwanted logouts
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Fix #9: NODE_ENV comparison uses lowercase "development" (Node.js convention)
    res.status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // BUG #6 FIX: 7 days
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success: true,
            message,
            user,
        });
};