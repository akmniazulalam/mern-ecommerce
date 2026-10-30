


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
