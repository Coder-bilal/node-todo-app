import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: {
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
            select: false,
        },
    },
    { timestamps: true }   // Fix #13: use Mongoose timestamps (adds createdAt + updatedAt automatically)
);

export const User = mongoose.models.User || mongoose.model("User", schema);