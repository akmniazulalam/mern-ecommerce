const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/modules/product/product.model");
const mongoose = require("mongoose");

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
