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
const app = require("../src/app");

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
});
