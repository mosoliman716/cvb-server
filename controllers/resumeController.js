import Resume from "../models/resume.js";

const sanitizeResumeUpdate = (resumeData) => {
  const allowedFields = [
    "title",
    "personalInfo",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "awards",
    "interests",
  ];

  if (
    !resumeData ||
    typeof resumeData !== "object" ||
    Array.isArray(resumeData)
  ) {
    return null;
  }

  const sanitized = {};
  for (const key of Object.keys(resumeData)) {
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }
    if (allowedFields.includes(key)) {
      sanitized[key] = resumeData[key];
    }
  }

  return sanitized;
};

//POST: api/resume/create
const createResume = async (req, res) => {
  const userId = req.userId;
  const { title } = req.body;

  const resume = await Resume.create({ title, _userId: userId });
  if (resume) {
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume });
  }
  return res.status(400).json({ message: "Resume not created" });
};
//DELETE: api/resume/delete
const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.body;

    const resume = await Resume.findOneAndDelete({
      _id: { $eq: resumeId },
      _userId: userId,
    });
    if (resume) {
      return res
        .status(200)
        .json({ message: "Resume deleted successfully", resume });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//GET: api/resume/data
const loadResume = async (req, res) => {
  const userId = req.userId;
  const { resumeId } = req.params;
  try {
    const resume = await Resume.findById(resumeId);
    return res.status(200).json({ message: "Resume found", resume: resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//PUT: api/resume/update
const updateResume = async (req, res) => {
  const userId = req.userId;
  const { resumeId, resumeData } = req.body;

  const safeResumeData = sanitizeResumeUpdate(resumeData);
  if (!safeResumeData || Object.keys(safeResumeData).length === 0) {
    return res.status(400).json({ message: "Invalid resume update payload" });
  }

  const resume = await Resume.findOneAndUpdate(
    { _userId: userId, _id: resumeId },
    safeResumeData,
    { new: true }
  );
  if (resume) {
    return res
      .status(200)
      .json({ message: "Resume updated successfully", resume });
  }
  return res.status(400).json({ message: "Resume not updated" });
};

export { createResume, deleteResume, loadResume, updateResume };
