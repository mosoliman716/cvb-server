import ai from "../config/ai.js";
import Resume from "../models/resume.js";

const enhanceProfessionalSummary = async (req, res) => {
  const { summary } = req.body;

  const response = await ai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "as a expert Cv creator , enhance this summary and make short and showing real professional career of person and return it as a text without any options or anything",
      },
      {
        role: "user",
        content: summary,
      },
    ],
  });

  res.status(200).json({
    message: "success",
    summary: response.choices[0].message.content,
  });
};

const enhanceJobDescription = async (req, res) => {
  const { jobDescription } = req.body;



  const response = await ai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "as a expert Cv creator , enhance this DESCRIPTION and make short and showing real skills  of person and return it as a text without any options or anything",
      },
      {
        role: "user",
        content: jobDescription,
      },
    ],
  });

  res.status(200).json({
    message: "success",
    description: response.choices[0].message.content,
  });
};
// later
const UplaodCV = async (req, res) => {
  const { resumeText }  = req.body;
  const userId = req.userId;
  if(!userId || userId == null){
    return res.status(400).json({ message: "User not found" });
  }

  try {
    const response = await ai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `as a expert ai assistant , extract this resume data and return it as a text without any options or anything in this schema {
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
              skills: [{ type: String }],`,
        },
        {
          role: "user",
          content: resumeText,
        },
      ],
      response_format: { type: "json_object" },
    });
    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    console.log(parsedData);
    const NewResume = await Resume.create({_userId: userId , ...parsedData });
    res.status(200).json({
      message: "success",
      resume: NewResume,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { enhanceProfessionalSummary, enhanceJobDescription, UplaodCV };
