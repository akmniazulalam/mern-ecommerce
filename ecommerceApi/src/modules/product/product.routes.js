const express = require("express");
const { withVariantImagesUpload } = require("./product.upload");
const { validateProductIdParam } = require("./product.middleware");
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

const writeWithVariantImages = [withVariantImagesUpload];
const withProductId = [validateProductIdParam];

/**
 * Legacy endpoints (unchanged paths for dashboard / storefront).
 */
router.post("/createproduct", ...writeWithVariantImages, productController);
router.get("/getproduct", getProductController);
router.get("/singleproduct/:id", ...withProductId, getSingleProductController);
router.patch(
  "/updateproduct/:id",
  ...withProductId,
  ...writeWithVariantImages,
  updateProductController,
);
router.delete("/deleteproduct/:id", ...withProductId, deleteProduct);
router.delete("/deleteallproduct", deleteAllProduct);

/**
 * RESTful aliases (same handlers, same request/response contracts).
 * Base path: /api/v1/product
 */
router.get("/", getProductController);
router.post("/", ...writeWithVariantImages, productController);
router.delete("/all", deleteAllProduct);

router.get("/:id/variants", ...withProductId, getProductVariantsController);
router.get("/:id", ...withProductId, getSingleProductController);
router.patch("/:id", ...withProductId, ...writeWithVariantImages, updateProductController);
router.delete("/:id", ...withProductId, deleteProduct);

module.exports = router;
