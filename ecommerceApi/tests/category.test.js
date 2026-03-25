process.env.DB_URL = "mongodb://127.0.0.1:27017/test";
process.env.SESSION_SECRET = "test-session-secret";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.CLOUD_NAME = "test-cloud";
process.env.API_KEY = "test-api-key";
process.env.API_SECRET = "test-api-secret";
process.env.RESEND_API_KEY = "test-resend-key";
process.env.PRIMARY_ADMIN_EMAIL = "admin@example.com";
process.env.DEMO_ADMIN_EMAIL = "demo@example.com";

const bcrypt = require("bcrypt");
const app = require("../src/app");
const request = require("supertest");
const User = require("../src/modules/auth/auth.model");
const Category = require("../src/modules/category/category.model");
const mongoose = require("mongoose");

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

// Database integration test for creating a category
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

describe("POST /api/v1/category/createcategory - Authorization", () => {
  let testUser;
  let agent;

  beforeEach(async () => {
    const uniqueId = Date.now();
    const testEmail = `test-user-${uniqueId}@example.com`;
    const password = "TestPassword123!";

    const hashedPassword = await bcrypt.hash(password, 10);

    testUser = await User.create({
      firstName: "Test",
      lastName: "User",
      email: testEmail,
      password: hashedPassword,
      isVerified: true,
      role: "user",
    });

    agent = request.agent(app);

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: testEmail,
      password,
    });

    expect(loginResponse.status).toBe(200);
  });

  afterEach(async () => {
    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }
  });

  it("should return 403 when a normal user tries to create a category", async () => {
    const response = await agent.post("/api/v1/category/createcategory").send({
      name: "Unauthorized Category",
      description: "Normal user should not create this",
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden",
    });
  });
});

describe("GET /api/v1/category/singlecategory/:id", () => {
  let testCategory;

  beforeEach(async () => {
    testCategory = await Category.create({
      name: `Single Test Category ${Date.now()}`,
      description: "Testing single category retrieval",
    });
  });

  afterEach(async () => {
    if (testCategory) {
      await Category.findByIdAndDelete(testCategory._id);
    }
  });

  it("should return a single category when a valid ID is provided", async () => {
    const response = await request(app).get(
      `/api/v1/category/singlecategory/${testCategory._id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        _id: testCategory._id.toString(),
        name: testCategory.name,
        description: testCategory.description,
      }),
    );
  });
});

describe("PATCH /api/v1/category/updatecategory/:id", () => {
  let testUser;
  let testCategory;
  let agent;
  let originalPrimaryAdminEmail;

  beforeEach(async () => {
    originalPrimaryAdminEmail = process.env.PRIMARY_ADMIN_EMAIL;

    const uniqueId = Date.now();
    const testEmail = `test-admin-${uniqueId}@example.com`;
    const password = "TestPassword123!";

    process.env.PRIMARY_ADMIN_EMAIL = testEmail;

    const hashedPassword = await bcrypt.hash(password, 10);

    testUser = await User.create({
      firstName: "Test",
      lastName: "Admin",
      email: testEmail,
      password: hashedPassword,
      isVerified: true,
      role: "admin",
    });

    testCategory = await Category.create({
      name: `Original Category ${uniqueId}`,
      description: "Original description",
    });

    agent = request.agent(app);

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: testEmail,
      password,
    });

    expect(loginResponse.status).toBe(200);
  });

  afterEach(async () => {
    if (testCategory) {
      await Category.findByIdAndDelete(testCategory._id);
    }

    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }

    process.env.PRIMARY_ADMIN_EMAIL = originalPrimaryAdminEmail;
  });

  it("should update a category when an admin is authenticated", async () => {
    const response = await agent
      .patch(`/api/v1/category/updatecategory/${testCategory._id}`)
      .send({
        name: "Updated Test Category",
        description: "Updated test description",
      });

    expect(response.status).toBe(200);

    const updatedCategory = await Category.findById(testCategory._id);

    expect(updatedCategory.name).toBe("Updated Test Category");
    expect(updatedCategory.description).toBe("Updated test description");
  });

  it("should return 404 when category does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await agent
      .patch(`/api/v1/category/updatecategory/${nonExistentId}`)
      .send({
        name: "Updated Category",
        description: "Updated description",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Category not found");
  });
});

describe("PATCH /api/v1/category/updatecategory/:id - Validation", () => {
  let testUser;
  let testCategory;
  let agent;
  let originalPrimaryAdminEmail;

  beforeEach(async () => {
    originalPrimaryAdminEmail = process.env.PRIMARY_ADMIN_EMAIL;

    const uniqueId = Date.now();
    const testEmail = `test-admin-${uniqueId}@example.com`;
    const password = "TestPassword123!";

    process.env.PRIMARY_ADMIN_EMAIL = testEmail;

    const hashedPassword = await bcrypt.hash(password, 10);

    testUser = await User.create({
      firstName: "Test",
      lastName: "Admin",
      email: testEmail,
      password: hashedPassword,
      isVerified: true,
      role: "admin",
    });

    testCategory = await Category.create({
      name: `Original Category ${Date.now()}`,
      description: "Original description",
    });

    agent = request.agent(app);

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: testEmail,
      password,
    });

    expect(loginResponse.status).toBe(200);
  });

  afterEach(async () => {
    if (testCategory) {
      await Category.findByIdAndDelete(testCategory._id);
    }

    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }

    process.env.PRIMARY_ADMIN_EMAIL = originalPrimaryAdminEmail;
  });

  it("should return 400 when category ID is invalid", async () => {
    const response = await agent
      .patch("/api/v1/category/updatecategory/invalid123")
      .send({
        name: "Updated Category",
        description: "Updated description",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid category id",
      field: "id",
    });
  });

  it("should return 400 when category name is missing", async () => {
    const response = await agent
      .patch(`/api/v1/category/updatecategory/${testCategory._id}`)
      .send({ description: "Updated description" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      field: "name",
      message: "Category name is required",
    });
  });

  it("should return 400 when category description is missing", async () => {
    const response = await agent
      .patch(`/api/v1/category/updatecategory/${testCategory._id}`)
      .send({ name: "Updated name" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      field: "description",
      message: "Category description is required",
    });
  });
});

describe("PATCH /api/v1/category/updatecategory/:id - Authorization", () => {
  let testUser;
  let testCategory;
  let agent;

  beforeEach(async () => {
    const uniqueId = Date.now();
    const testEmail = `test-user-${uniqueId}@example.com`;
    const password = "TestPassword123!";

    const hashedPassword = await bcrypt.hash(password, 10);

    testUser = await User.create({
      firstName: "Test",
      lastName: "User",
      email: testEmail,
      password: hashedPassword,
      isVerified: true,
      role: "user",
    });

    testCategory = await Category.create({
      name: `Test Category ${uniqueId}`,
      description: "Testing authorization",
    });

    agent = request.agent(app);

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: testEmail,
      password,
    });

    expect(loginResponse.status).toBe(200);
  });

  afterEach(async () => {
    if (testCategory) {
      await Category.findByIdAndDelete(testCategory._id);
    }

    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }
  });

  it("should return 403 when a normal user tries to update a category", async () => {
    const response = await agent
      .patch(`/api/v1/category/updatecategory/${testCategory._id}`)
      .send({
        name: "Updated Category",
        description: "Updated description",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden",
    });
  });
});

describe("PATCH /api/v1/category/updatecategory/:id - Authentication", () => {
  it("should return 401 when user is not authenticated", async () => {
    const response = await request(app)
      .patch("/api/v1/category/updatecategory/507f1f77bcf86cd799439011")
      .send({
        name: "Updated Category",
        description: "Updated description",
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Unauthorized access",
    });
  });
});

describe("DELETE /api/v1/category/deletecategory/:id", () => {
  let testUser;
  let testCategory;
  let agent;
  let originalPrimaryAdminEmail;

  beforeEach(async () => {
    originalPrimaryAdminEmail = process.env.PRIMARY_ADMIN_EMAIL;

    const uniqueId = Date.now();
    const testEmail = `test-admin-${uniqueId}@example.com`;
    const password = "TestPassword123!";

    process.env.PRIMARY_ADMIN_EMAIL = testEmail;

    const hashedPassword = await bcrypt.hash(password, 10);

    testUser = await User.create({
      firstName: "Test",
      lastName: "Admin",
      email: testEmail,
      password: hashedPassword,
      isVerified: true,
      role: "admin",
    });

    testCategory = await Category.create({
      name: `Delete Test Category ${uniqueId}`,
      description: "Testing category deletion",
    });

    agent = request.agent(app);

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: testEmail,
      password,
    });

    expect(loginResponse.status).toBe(200);
  });

  afterEach(async () => {
    if (testCategory) {
      await Category.findByIdAndDelete(testCategory._id);
    }

    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }

    process.env.PRIMARY_ADMIN_EMAIL = originalPrimaryAdminEmail;
  });

  it("should delete a category when an admin is authenticated", async () => {
    const response = await agent.delete(
      `/api/v1/category/deletecategory/${testCategory._id}`,
    );

    expect(response.status).toBe(200);

    const deletedCategory = await Category.findById(testCategory._id);

    expect(deletedCategory).toBeNull();
  });

  it("should return 400 when category ID is invalid", async () => {
    const response = await agent.delete(
      "/api/v1/category/deletecategory/invalid123",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid category id",
      field: "id",
    });
  });
});

describe("DELETE /api/v1/category/deletecategory/:id - Authentication", () => {
  it("should return 401 when user is not authenticated", async () => {
    const response = await request(app).delete(
      "/api/v1/category/deletecategory/507f1f77bcf86cd799439011",
    );

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Unauthorized access",
    });
  });
});