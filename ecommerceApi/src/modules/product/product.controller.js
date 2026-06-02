const Product = require("./product.model");
const { sendError, handleMongoError } = require("./product.errors");
const {
  parseVariantsJson,
  validateProductBasics,
  validateVariants,
  validateCreateImages,
  validateUpdateImages,
  toTrimmedString,
} = require("./product.validators");
const {
  normalizeVariantsForSave,
  attachImagesToVariants,
  uploadFiles,
  applyVariantImageUpdates,
  formatProductResponse,
  formatProductsResponse,
} = require("./product.variant.utils");

async function productController(req, res) {
  try {
    const { name, description, category, variants } = req.body;

    const basicsError = validateProductBasics({ name, description, category });
    if (basicsError) {
      return sendError(res, basicsError);
    }

    const parsed = parseVariantsJson(variants);
    if (parsed.error) {
      return sendError(res, parsed.error);
    }

    const variantsError = validateVariants(parsed.data, { requireStockMinOne: true });
    if (variantsError) {
      return sendError(res, variantsError);
    }

    const imagesError = validateCreateImages(req.files, parsed.data.length);
    if (imagesError) {
      return sendError(res, imagesError);
    }

    const imageUrls = await uploadFiles(req.files);
    const normalizedVariants = normalizeVariantsForSave(parsed.data);
    const variantsWithImages = attachImagesToVariants(normalizedVariants, imageUrls);

    const product = new Product({
      name: toTrimmedString(name),
      description: toTrimmedString(description),
      category: toTrimmedString(category),
      variants: variantsWithImages,
    });

    await product.save();

    return res.json({
      message: "Product Added Successfully",
      data: formatProductResponse(product),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getProductController(req, res) {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.json({
      message: "Success",
      data: formatProductsResponse(products),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getSingleProductController(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: formatProductResponse(product),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function updateProductController(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, variants } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

    const basicsError = validateProductBasics({ name, description, category });
    if (basicsError) {
      return sendError(res, basicsError);
    }

    const parsed = parseVariantsJson(variants);
    if (parsed.error) {
      return sendError(res, parsed.error);
    }

    const variantsError = validateVariants(parsed.data, { requireStockMinOne: true });
    if (variantsError) {
      return sendError(res, variantsError);
    }

    const updateImagesError = validateUpdateImages(req.files, req.body.imageIndexes);
    if (updateImagesError) {
      return sendError(res, updateImagesError);
    }

    let normalizedVariants = normalizeVariantsForSave(parsed.data);
    normalizedVariants = await applyVariantImageUpdates(
      normalizedVariants,
      req.files,
      req.body.imageIndexes,
    );

    product.name = toTrimmedString(name);
    product.description = toTrimmedString(description);
    product.category = toTrimmedString(category);
    product.variants = normalizedVariants;

    await product.save();

    return res.json({
      message: "Product updated successfully",
      data: formatProductResponse(product),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

    return res.json({
      message: "Successfully deleted",
      data: formatProductResponse(deleted),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function deleteAllProduct(req, res) {
  try {
    const result = await Product.deleteMany({});

    return res.json({
      message: "Successfully deleted",
      data: result,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getProductVariantsController(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select("name variants");

    if (!product) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

    const formatted = formatProductResponse(product);

    return res.status(200).json({
      message: "Success",
      data: formatted.variants,
      meta: {
        productId: formatted._id,
        productName: formatted.name,
        variantCount: formatted.variants?.length ?? 0,
      },
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

module.exports = {
  productController,
  updateProductController,
  getProductController,
  getSingleProductController,
  getProductVariantsController,
  deleteProduct,
  deleteAllProduct,
};
