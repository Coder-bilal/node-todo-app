import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {

    // Fix #3: JWT now has expiresIn matching the cookie maxAge (15 minutes)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

    // Fix #9: NODE_ENV comparison uses lowercase "development" (Node.js convention)
    res.status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success: true,
            message,
        });
};