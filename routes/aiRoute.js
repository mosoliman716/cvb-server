import express from "express";
import verifyToken from "../middlewares/auth.js";
import { enhanceProfessionalSummary, enhanceJobDescription, UplaodCV} from "../controllers/aiContoller.js";


const AIRouter = express.Router();

AIRouter.post("/enhance-professional-summary", enhanceProfessionalSummary);
AIRouter.post("/enhance-job-description", enhanceJobDescription);
AIRouter.post("/upload-cv", verifyToken, UplaodCV);

export default AIRouter;