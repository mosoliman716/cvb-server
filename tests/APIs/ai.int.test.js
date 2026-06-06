import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../../config/data.js";
import app from "../../server.js";
import ai from "../../config/ai.js";

dotenv.config();

// use a dedicated test database
process.env.MONGO_URI = "mongodb://localhost:27017/cvb_test";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("AI API integration tests", () => {
  test("enhance professional summary returns enhanced text", async () => {
    // mock AI response
    ai.chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Enhanced summary text" } }],
        }),
      },
    };

    const res = await request(app)
      .post("/api/ai/enhance-professional-summary")
      .send({ summary: "original summary" })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "success");
    expect(res.body).toHaveProperty("summary", "Enhanced summary text");
  });

  test("enhance job description returns enhanced description", async () => {
    ai.chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Enhanced job description" } }],
        }),
      },
    };

    const res = await request(app)
      .post("/api/ai/enhance-job-description")
      .send({ jobDescription: "original description" })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "success");
    expect(res.body).toHaveProperty("description", "Enhanced job description");
  });

  test("upload-cv creates resume from AI extracted JSON", async () => {
    // create a user and login to get token
    const testUser = {
      name: "AIUser",
      email: "aiuser@example.com",
      password: "password123",
    };

    await request(app)
      .post("/api/user/signup")
      .send(testUser)
      .set("Accept", "application/json");
    const loginRes = await request(app)
      .post("/api/user/login")
      .send({ email: testUser.email, password: testUser.password });
    const token = loginRes.body.token;
    const userId = loginRes.body.user._id;

    // AI returns a JSON string representing the resume data
    const fakeExtracted = JSON.stringify({
      title: "AI Resume",
      personal_info: { full_name: "AI Person" },
    });
    ai.chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: fakeExtracted } }],
        }),
      },
    };

    const res = await request(app)
      .post("/api/ai/upload-cv")
      .set("Authorization", token)
      .send({ resumeText: "Some CV text" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "success");
    expect(res.body).toHaveProperty("resume");
    expect(res.body.resume.title).toBe("AI Resume");
    expect(String(res.body.resume._userId)).toBe(String(userId));
  });
});
