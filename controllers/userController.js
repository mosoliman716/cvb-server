import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Resume from "../models/resume.js";

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};
// Post : api/user/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  //Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 6);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    const generatedToken = generateToken(user._id);
    return res.status(201).json({
      message: "User created successfully",
      user,
      token: generatedToken,
    });
  }
  return res.status(400).json({ message: "User not created" });
};

// post: api/user/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    return res.status(200).json({ message: "Login successful", user, token });
  }
  return res.status(400).json({ message: "Invalid email or password" });
};

//GET: api/user/data
const getResumeById = async (req, res) => {
  const userId = req.userId;
  try {
    const resume = await Resume.find({ _userId: userId });
    return res.status(200).json({ message: "Resume found", resume: resume });
  } catch (error) {
    return res.status(400).json({ message: "Resume not found" });
  }
};

export { registerUser, loginUser, getResumeById };
