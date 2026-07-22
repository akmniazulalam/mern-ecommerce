const mongoose = require("mongoose");
const { sendError } = require("./product.errors");
const {
  parseVariantsJson,
  validateCreateImages,
  validateProductBasics,
  validateUpdateImages,
  validateVariants,
} = require("./product.validators");

function isValidProductId(id) {
  if (id === undefined || id === null || id === "") {
    return false;
  }

  return mongoose.Types.ObjectId.isValid(String(id));
}

function validateProductIdParam(req, res, next) {
  if (!isValidProductId(req.params.id)) {
    return sendError(res, {
      status: 400,
      message: "Invalid product id",
    });
  }

  return next();
}

function validateProductCreateRequest(req, res, next) {
  const { name, description, category, variants } = req.body || {};

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

  return next();
}

function validateProductUpdateRequest(req, res, next) {
  const { name, description, category, variants } = req.body || {};

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

  return next();
}

module.exports = {
  isValidProductId,
  validateProductIdParam,
  validateProductCreateRequest,
  validateProductUpdateRequest,
};
