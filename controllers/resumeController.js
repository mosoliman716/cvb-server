import Resume from "../models/resume.js";

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
      _id: resumeId,
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

  const resume = await Resume.findOneAndUpdate(
    { _userId: userId, _id: resumeId },
    resumeData,
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
