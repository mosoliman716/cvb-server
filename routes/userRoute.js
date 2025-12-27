import express from "express";
import verifyToken from "../middlewares/auth.js";
import { registerUser, loginUser, getResumeById } from "../controllers/userController.js";


const UserRouter = express.Router();

UserRouter.post("/signup", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/data", verifyToken, getResumeById);

export default UserRouter;