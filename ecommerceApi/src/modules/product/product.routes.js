const express = require("express");
const { withVariantImagesUpload } = require("./product.upload");
const {
  validateProductCreateRequest,
  validateProductIdParam,
  validateProductListQuery,
  validateProductUpdateRequest,
} = require("./product.middleware");
const { authMiddleware, adminMiddleware } = require("../auth/auth.middleware");
const {
  productController,
  updateProductController,
  getProductController,
  getSingleProductController,
  getProductVariantsController,
  deleteProduct,
  deleteAllProduct,
} = require("./product.controller");

const router = express.Router();

const adminOnly = [authMiddleware, adminMiddleware];
const writeWithVariantImages = [withVariantImagesUpload];
const withProductId = [validateProductIdParam];

/**
 * Legacy endpoints (unchanged paths for dashboard / storefront).
 */
router.post("/createproduct", ...adminOnly, ...writeWithVariantImages, validateProductCreateRequest, productController);
router.get("/getproduct", validateProductListQuery, getProductController);
router.get("/singleproduct/:id", ...withProductId, getSingleProductController);
router.patch(
  "/updateproduct/:id",
  ...adminOnly,
  ...withProductId,
  ...writeWithVariantImages,
  validateProductUpdateRequest,
  updateProductController,
);
router.delete("/deleteproduct/:id", ...adminOnly, ...withProductId, deleteProduct);
router.delete("/deleteallproduct", ...adminOnly, deleteAllProduct);

/**
 * RESTful aliases (same handlers, same request/response contracts).
 * Base path: /api/v1/product
 */
router.get("/", validateProductListQuery, getProductController);
router.post("/", ...adminOnly, ...writeWithVariantImages, validateProductCreateRequest, productController);
router.delete("/all", ...adminOnly, deleteAllProduct);

router.get("/:id/variants", ...withProductId, getProductVariantsController);
router.get("/:id", ...withProductId, getSingleProductController);
router.patch("/:id", ...adminOnly, ...withProductId, ...writeWithVariantImages, validateProductUpdateRequest, updateProductController);
router.delete("/:id", ...adminOnly, ...withProductId, deleteProduct);

module.exports = router;
