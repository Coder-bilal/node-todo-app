import ErrorHandler from "../middlewares/error.js";
// Fix #2: consistent lowercase import path (matches the actual filename task.js)
import { Task } from "../models/task.js";

export const newTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // Fix #7: input validation for task creation
        if (!title || !description) {
            return next(new ErrorHandler("Title and description are required", 400));
        }

        await Task.create({
            title,
            description,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getMyTask = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const tasks = await Task.find({ user: userId });

        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fix #8: filter by both id AND the logged-in user to prevent unauthorized access
        const task = await Task.findOne({ _id: id, user: req.user._id });

        if (!task) {
            return next(new ErrorHandler("Task Not Found", 404));
        }

        task.isCompleted = !task.isCompleted;
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task Updated Successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fix #8: filter by both id AND the logged-in user to prevent unauthorized access
        const task = await Task.findOne({ _id: id, user: req.user._id });

        if (!task) {
            return next(new ErrorHandler("Task Not Found", 404));
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task Deleted Successfully",
        });
    } catch (error) {
        next(error);
    }
};