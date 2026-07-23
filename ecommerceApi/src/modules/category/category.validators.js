const {
  isMissing,
  isValidObjectId,
  validateRequest,
} = require("../../common/middleware/requestValidation");

function validateCategoryBody(req) {
  const { name, description } = req.body || {};

  if (isMissing(name)) {
    return { field: "name", message: "Category name is required" };
  }

  if (isMissing(description)) {
    return { field: "description", message: "Category description is required" };
  }

  return null;
}

function validateSubCategoryBody(req) {
  const { name, categoryId } = req.body || {};

  if (isMissing(name)) {
    return { field: "name", message: "Subcategory name is required" };
  }

  if (!isValidObjectId(categoryId)) {
    return { field: "categoryId", message: "Invalid category id" };
  }

  return null;
}

module.exports = {
  validateCategoryBody: validateRequest(validateCategoryBody),
  validateSubCategoryBody: validateRequest(validateSubCategoryBody),
};
