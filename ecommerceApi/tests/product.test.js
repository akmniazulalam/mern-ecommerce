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
const mongoose = require("mongoose");
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
    const response = await request(app).get("/api/v1/product/getproduct");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
    expect(response.body.data).toEqual([]);
    expect(response.body.meta.total).toBe(0);
  });
});

describe("GET /api/v1/product/singleproduct/:id", () => {
  let testProduct;

  beforeEach(async () => {
    testProduct = await Product.create({
      name: `Single Test Product ${Date.now()}`,
      description: "Product created for single product testing",
      category: "Test Category",
      variants: [
        {
          sku: `SINGLE-${Date.now()}`,
          price: 1500,
          stock: 10,
          color: "Black",
          size: "M",
        },
      ],
    });
  });

  afterEach(async () => {
    if (testProduct) {
      await Product.findByIdAndDelete(testProduct._id);
    }
  });

  it("should return a single product by ID", async () => {
    const response = await request(app).get(
      `/api/v1/product/singleproduct/${testProduct._id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");

    expect(response.body.data).toEqual(
      expect.objectContaining({
        _id: testProduct._id.toString(),
        name: testProduct.name,
        description: testProduct.description,
      }),
    );
  });
});

describe("GET /api/v1/product/singleproduct/:id - Invalid ID", () => {
  it("should return 400 when product ID is invalid", async () => {
    const response = await request(app).get(
      "/api/v1/product/singleproduct/abc123",
    );

    expect(response.status).toBe(400);
  });
});

describe("GET /api/v1/product/singleproduct/:id - Not Found", () => {
  it("should return 404 when product does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app).get(
      `/api/v1/product/singleproduct/${nonExistentId}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });
});

describe("GET /api/v1/product/:id/variants", () => {
  let testProduct;

  beforeEach(async () => {
    testProduct = await Product.create({
      name: `Variant Test Product ${Date.now()}`,
      description: "Product created for variant testing",
      category: "Test Category",
      variants: [
        {
          sku: `VAR-A-${Date.now()}`,
          size: "M",
          color: "Black",
          price: 1500,
          stock: 10,
        },
        {
          sku: `VAR-B-${Date.now()}`,
          size: "L",
          color: "White",
          price: 1800,
          stock: 5,
        },
      ],
    });
  });

  afterEach(async () => {
    if (testProduct) {
      await Product.findByIdAndDelete(testProduct._id);
    }
  });

  it("should return all variants of a product", async () => {
    const response = await request(app).get(
      `/api/v1/product/${testProduct._id}/variants`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");

    expect(response.body.data).toHaveLength(2);

    expect(response.body.meta).toEqual({
      productId: testProduct._id.toString(),
      productName: testProduct.name,
      variantCount: 2,
    });

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sku: `VAR-A-${testProduct.variants[0].sku.split("-").pop()}`,
          size: "M",
          color: "Black",
          price: 1500,
          stock: 10,
        }),
        expect.objectContaining({
          sku: `VAR-B-${testProduct.variants[1].sku.split("-").pop()}`,
          size: "L",
          color: "White",
          price: 1800,
          stock: 5,
        }),
      ]),
    );
  });
});

describe("GET /api/v1/product/:id/variants - Not Found", () => {
  it("should return 404 when product does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const response = await request(app).get(
      `/api/v1/product/${nonExistentId}/variants`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });
});

describe("GET /api/v1/product/:id/variants - Empty Variants", () => {
  let testProduct;

  beforeEach(async () => {
    testProduct = await Product.create({
      name: `Empty Variant Product ${Date.now()}`,
      description: "Product without variants",
      category: "Test Category",
      variants: [],
    });
  });

  afterEach(async () => {
    if (testProduct) {
      await Product.findByIdAndDelete(testProduct._id);
    }
  });

  it("should return an empty array when product has no variants", async () => {
    const response = await request(app).get(
      `/api/v1/product/${testProduct._id}/variants`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
    expect(response.body.data).toEqual([]);

    expect(response.body.meta).toEqual({
      productId: testProduct._id.toString(),
      productName: testProduct.name,
      variantCount: 0,
    });
  });
});

describe("GET /api/v1/product/getproduct - Pagination", () => {
  let testProducts = [];

  beforeEach(async () => {
    testProducts = await Product.create([
      {
        name: `Pagination Product A ${Date.now()}`,
        description: "First pagination product",
        variants: [{ price: 1000, stock: 10 }],
      },
      {
        name: `Pagination Product B ${Date.now()}`,
        description: "Second pagination product",
        variants: [{ price: 2000, stock: 10 }],
      },
      {
        name: `Pagination Product C ${Date.now()}`,
        description: "Third pagination product",
        variants: [{ price: 3000, stock: 10 }],
      },
    ]);
  });

  afterEach(async () => {
    await Product.deleteMany({
      _id: { $in: testProducts.map((product) => product._id) },
    });
  });

  it("should return only 2 products when limit is 2", async () => {
    const response = await request(app).get(
      "/api/v1/product/getproduct?page=1&limit=2",
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);

    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(2);
    expect(response.body.meta.total).toBeGreaterThanOrEqual(3);
  });
});

describe("GET /api/v1/product/getproduct - Second Page Pagination", () => {
  let testProducts = [];

  beforeEach(async () => {
    testProducts = await Product.create([
      {
        name: `Page Test A ${Date.now()}`,
        description: "First pagination product",
        variants: [{ price: 1000, stock: 10 }],
      },
      {
        name: `Page Test B ${Date.now()}`,
        description: "Second pagination product",
        variants: [{ price: 2000, stock: 10 }],
      },
      {
        name: `Page Test C ${Date.now()}`,
        description: "Third pagination product",
        variants: [{ price: 3000, stock: 10 }],
      },
      {
        name: `Page Test D ${Date.now()}`,
        description: "Fourth pagination product",
        variants: [{ price: 4000, stock: 10 }],
      },
    ]);
  });

  afterEach(async () => {
    await Product.deleteMany({
      _id: {
        $in: testProducts.map((product) => product._id),
      },
    });
  });

  
});
