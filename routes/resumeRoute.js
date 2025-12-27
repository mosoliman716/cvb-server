import express from "express";
import verifyToken from "../middlewares/auth.js";
import { createResume, deleteResume, updateResume, loadResume } from "../controllers/resumeController.js";


const ResumeRouter = express.Router();

ResumeRouter.post("/create", verifyToken, createResume);
ResumeRouter.post("/delete", verifyToken,deleteResume);
ResumeRouter.put("/update", verifyToken, updateResume);
ResumeRouter.get("/data/:resumeId", verifyToken, loadResume);

export default ResumeRouter;