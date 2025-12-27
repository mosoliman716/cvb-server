import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  template: { type: String, default: "classic" },
  accent_color: { type: String, default: "red" },
  personal_info: {
    full_name: { type: String, },
    email: { type: String },
    phone: { type: String },
    location:{ type: String },
    website: { type: String },
    profession: { type: String },
  },
  professional_summary: { type: String },
  experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean },
      }
  ],
  education: [
    {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        graduation_date: { type: String },
        gpa: { type: String },
    }
  ],
  projects: [
    {
        name: { type: String },
        type: { type: String },
        description: { type: String },
    }
  ],
  skills: [{ type: String }],
}, { timestamps: true, minimize: false});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
