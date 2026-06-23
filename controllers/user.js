import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { Task } from "../models/task.js";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

// Get All Users — Fix #5: this route is now protected (see routes/user.js)
export const getallusers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(error);
    }
};

// Login User
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Fix #7: basic input validation
        if (!email || !password) {
            return next(new ErrorHandler("Email and password are required", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        sendCookie(user, res, `Welcome back, ${user.name}`, 200);
    } catch (error) {
        next(error);
    }
};

// Register New User
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Fix #7: basic input validation
        if (!name || !email || !password) {
            return next(new ErrorHandler("Name, email, and password are required", 400));
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new ErrorHandler("Please provide a valid email address", 400));
        }

        // Minimum password length
        if (password.length < 6) {
            return next(new ErrorHandler("Password must be at least 6 characters", 400));
        }

        let user = await User.findOne({ email });

        if (user) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        sendCookie(user, res, "User registered successfully", 201);
    } catch (error) {
        next(error);
    }
};

// Logout User — Fix #6: route changed to POST (see routes/user.js)
export const logout = (req, res) => {
    // Fix #9: NODE_ENV comparison uses lowercase "development"
    res.status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
};

// Get My Profile
export const getMyProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
};
