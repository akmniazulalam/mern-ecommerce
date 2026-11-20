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
const Product = require("../src/modules/product/product.model");

describe("GET /api/v1/product/getproduct", () => {
  let testProduct;

  beforeEach(async () => {
    testProduct = await Product.create({
      name: `Test Product ${Date.now()}`,
      description: "Product created for integration testing",
      category: "Test Category",
      variants: [
        {
          sku: `TEST-${Date.now()}`,
          size: "M",
          color: "Black",
          price: 1000,
          stock: 10,
        },
      ],
    });
  });

  afterEach(async () => {
    if (testProduct) {
      await Product.findByIdAndDelete(testProduct._id);
    }
  });

  it("should return all products", async () => {
    const response = await request(app).get("/api/v1/product/getproduct");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: testProduct._id.toString(),
        }),
      ]),
    );

    expect(response.body.meta.total).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /api/v1/product/getproduct - Empty List", () => {
  it("should return an empty array when no products exist", async () => {
    const response = await request(app).get(
      "/api/v1/product/getproduct",
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
    expect(response.body.data).toEqual([]);
    expect(response.body.meta.total).toBe(0);
  });
});