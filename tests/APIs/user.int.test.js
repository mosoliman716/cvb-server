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
  // drop test database and close connection
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User API integration tests", () => {
  const testUser = { name: "IntTest", email: "inttest@example.com", password: "password123" };
  let authToken = null;

    describe("Signup", () => {
      test("should create a new user and return token", async () => {
        const signupRes = await request(app)
          .post("/api/user/signup")
          .send(testUser)
          .set("Accept", "application/json");

        expect(signupRes.status).toBe(201);
        expect(signupRes.body).toHaveProperty("token");
        expect(signupRes.body).toHaveProperty("user");
      });

       test("should send an error for duplicate email", async () => {
        const signupRes = await request(app)
          .post("/api/user/signup")
          .send(testUser)
          .set("Accept", "application/json");

        expect(signupRes.status).toBe(400);
      });
    });

    describe("Login", () => {
      test("should login with created user and return token", async () => {
        const loginRes = await request(app)
          .post("/api/user/login")
          .send({ email: testUser.email, password: testUser.password })
          .set("Accept", "application/json");

        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty("token");
        authToken = loginRes.body.token;
      });
    });

    describe("GetResume", () => {
      test("should retrieve resume data (empty array ok)", async () => {
        const dataRes = await request(app)
          .get("/api/user/data")
          .set("Authorization", authToken)
          .set("Accept", "application/json");

        expect(dataRes.status).toBe(200);
        expect(dataRes.body).toHaveProperty("resume");
      });
    });
  } 
);
