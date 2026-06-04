import mongoose from "mongoose";

const dateRegex = /^\d{4}(-\d{2}(-\d{2})?)?$/;

const resumeSchema = new mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    template: {
      type: String,
      default: "classic",
      enum: ["classic", "ats", "modern", "minimal"],
    },
    accent_color: {
      type: String,
      default: "red",
    },
    personal_info: {
      full_name: { type: String, trim: true, maxlength: 100 },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          message: (props) => `${props.value} is not a valid email`,
        },
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: (v) => !v || /^\+?[0-9\-\s().]{7,30}$/.test(v),
          message: (props) => `${props.value} is not a valid phone number`,
        },
      },
      location: { type: String, trim: true },
      website: {
        type: String,
        trim: true,
        validate: {
          validator: (v) =>
            !v || /^(https?:\/\/)?([\w\-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(v),
          message: (props) => `${props.value} is not a valid website`,
        },
      },
      profession: { type: String, trim: true, maxlength: 100 },
    },
    professional_summary: { type: String, maxlength: 2000 },
    experience: [
      {
        company: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
        start_date: {
          type: String,
          required: true,
          validate: {
            validator: (v) => !v || dateRegex.test(v),
            message: (props) => `${props.value} is not a valid date`,
          },
        },
        end_date: {
          type: String,
          validate: {
            validator: (v) => !v || dateRegex.test(v),
            message: (props) => `${props.value} is not a valid date`,
          },
        },
        description: { type: String },
        is_current: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        institution: { type: String, required: true, trim: true },
        degree: { type: String, required: true, trim: true },
        field: { type: String, trim: true },
        graduation_date: {
          type: String,
          validate: {
            validator: (v) => !v || dateRegex.test(v),
            message: (props) => `${props.value} is not a valid date`,
          },
        },
        gpa: {
          type: String,
          validate: {
            validator: (v) => !v || /^[0-4](\.\d+)?$/.test(v),
            message: (props) => `${props.value} is not a valid gpa`,
          },
        },
      },
    ],
    projects: [
      {
        name: { type: String, required: true, trim: true },
        type: { type: String, trim: true },
        description: { type: String },
      },
    ],
    skills: {
      type: [String],
    },
  },
  { timestamps: true, minimize: false },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
