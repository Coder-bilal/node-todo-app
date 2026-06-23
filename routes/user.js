import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getallusers, register, login, getMyProfile, logout } from "../controllers/user.js";

const router = express.Router();

// Fix #5: protect getallusers — only logged-in users can see all users
router.get("/all", isAuthenticated, getallusers);

router.post("/new", register);
router.post("/login", login);

// Fix #6: logout changed from GET to POST (state-changing operation)
router.post("/logout", logout);

router.get("/me", isAuthenticated, getMyProfile);

export default router;