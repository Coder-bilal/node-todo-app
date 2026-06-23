import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fix #14: handle null user (e.g. user deleted after token was issued)
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists. Please login again.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};