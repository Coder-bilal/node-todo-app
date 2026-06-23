import mongoose from "mongoose";

export const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            dbName: "backendapi",
        })
        .then(() => console.log("Database Connected"))
        // Fix #4: crash the process on DB connection failure instead of silently continuing
        .catch((e) => {
            console.error("Database connection failed:", e);
            process.exit(1);
        });
};