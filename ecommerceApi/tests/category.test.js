process.env.DB_URL = "mongodb://127.0.0.1:27017/test";
process.env.SESSION_SECRET = "test-session-secret";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.CLOUD_NAME = "test-cloud";
process.env.API_KEY = "test-api-key";
process.env.API_SECRET = "test-api-secret";
process.env.RESEND_API_KEY = "test-resend-key";
process.env.PRIMARY_ADMIN_EMAIL = "admin@example.com";
process.env.DEMO_ADMIN_EMAIL = "demo@example.com";

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const User = require("../src/modules/auth/auth.model");
const Category = require("../src/modules/category/category.model");

// Existing validation tests
describe("GET /api/v1/category/singlecategory/:id", () => {
  it("should return 400 when category ID is invalid", async () => {
    const response = await request(app).get(
      "/api/v1/category/singlecategory/abc123",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid category id",
      field: "id",
    });
  });

  it("should return 404 when category ID is missing", async () => {
    const response = await request(app).get("/api/v1/category/singlecategory/");

    expect(response.status).toBe(404);
  });
});

// Database integration test
describe("GET /api/v1/category/getallcategory", () => {
  let testCategory;

  beforeEach(async () => {
    testCategory = await Category.create({
      name: `Test Category ${Date.now()}`,
      description: "Category created for integration testing",
    });
  });

  afterEach(async () => {
    if (testCategory) {
      await Category.findByIdAndDelete(testCategory._id);
    }
  });

  it("should return all categories", async () => {
    const response = await request(app).get("/api/v1/category/getallcategory");

    expect(response.status).toBe(200);

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: testCategory._id.toString(),
          name: testCategory.name,
          description: testCategory.description,
        }),
      ]),
    );
  });
});

describe("POST /api/v1/category/createcategory", () => {
  let testUser;
  let testCategoryName;
  let agent;
  let originalPrimaryAdminEmail;

  beforeEach(async () => {
    originalPrimaryAdminEmail = process.env.PRIMARY_ADMIN_EMAIL;

    const uniqueId = Date.now();

    const testEmail = `test-admin-${uniqueId}@example.com`;
    const password = "TestPassword123!";

    // Make this test user the primary admin
    process.env.PRIMARY_ADMIN_EMAIL = testEmail;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create temporary admin user
    testUser = await User.create({
      firstName: "Test",
      lastName: "Admin",
      email: testEmail,
      password: hashedPassword,
      isVerified: true,
      role: "admin",
    });

    // Create an agent to preserve the session cookie
    agent = request.agent(app);

    // Login using the actual login endpoint
    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: testEmail,
      password,
    });

    expect(loginResponse.status).toBe(200);

    testCategoryName = `Test Category ${uniqueId}`;
  });

  afterEach(async () => {
    if (testCategoryName) {
      await Category.deleteOne({ name: testCategoryName });
    }

    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }

    process.env.PRIMARY_ADMIN_EMAIL = originalPrimaryAdminEmail;
  });

  it("should create a category when an admin is authenticated", async () => {
    const response = await agent.post("/api/v1/category/createcategory").send({
      name: testCategoryName,
      description: "Test category description",
    });

    expect(response.status).toBe(200);

    expect(response.body.message).toBe("Category Added Successfully");

    // Verify that the category was actually saved in MongoDB
    const createdCategory = await Category.findOne({
      name: testCategoryName,
    });

    expect(createdCategory).not.toBeNull();
    expect(createdCategory.description).toBe("Test category description");
  });

  it("should return 400 when category name is missing", async () => {
    const response = await agent.post("/api/v1/category/createcategory").send({
      description: "Test category description",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Category name is required",
      field: "name",
    });
  });

  it("should return 400 when category description is missing", async () => {
    const response = await agent.post("/api/v1/category/createcategory").send({
      name: "Test Category Without Description",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Category description is required",
      field: "description",
    });
  });
});
