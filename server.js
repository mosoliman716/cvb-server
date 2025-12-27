import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/data.js";
import UserRouter from "./routes/userRoute.js";
import ResumeRouter from "./routes/resumeRoute.js";
import AIRouter from "./routes/aiRoute.js";

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(express.json());


app.use("/api/user", UserRouter);
app.use("/api/resume", ResumeRouter);
app.use("/api/ai", AIRouter);


connectDB();


app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
