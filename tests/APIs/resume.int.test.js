import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../../config/data.js";
import app from "../../server.js";

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

describe("Resume API integration tests", () => {
  const testUser = {
    name: "ResumeInt",
    email: "resumeint@example.com",
    password: "password123",
  };
  let authToken = null;
  let resumeId = null;

  test("signup and login to get auth token", async () => {
    const signupRes = await request(app)
      .post("/api/user/signup")
      .send(testUser)
      .set("Accept", "application/json");

    expect(signupRes.status).toBe(201);
    expect(signupRes.body).toHaveProperty("token");

    const loginRes = await request(app)
      .post("/api/user/login")
      .send({ email: testUser.email, password: testUser.password })
      .set("Accept", "application/json");

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    authToken = loginRes.body.token;
  });

  test("should create a resume", async () => {
    const res = await request(app)
      .post("/api/resume/create")
      .set("Authorization", authToken)
      .send({ title: "Test Resume" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("resume");
    expect(res.body.resume).toHaveProperty("_id");
    resumeId = res.body.resume._id;
  });

  test("should load the created resume", async () => {
    const res = await request(app)
      .get(`/api/resume/data/${resumeId}`)
      .set("Authorization", authToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("resume");
    expect(res.body.resume).not.toBeNull();
    expect(res.body.resume._id).toBe(resumeId);
  });

  test("should update the resume with allowed fields", async () => {
    const res = await request(app)
      .put("/api/resume/update")
      .set("Authorization", authToken)
      .send({
        resumeId,
        resumeData: { title: "Updated Title", summary: "Updated summary" },
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("resume");
    expect(res.body.resume.title).toBe("Updated Title");
  });

  test("should reject update with no allowed fields", async () => {
    const res = await request(app)
      .put("/api/resume/update")
      .set("Authorization", authToken)
      .send({ resumeId, resumeData: { malicious: "x", $where: "1==1" } });

    expect(res.status).toBe(400);
  });

  test("should delete the resume", async () => {
    const res = await request(app)
      .post("/api/resume/delete")
      .set("Authorization", authToken)
      .send({ resumeId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("resume");
  });

  test("loading deleted resume should return null resume", async () => {
    const res = await request(app)
      .get(`/api/resume/data/${resumeId}`)
      .set("Authorization", authToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("resume");
    expect(res.body.resume).toBeNull();
  });
});
