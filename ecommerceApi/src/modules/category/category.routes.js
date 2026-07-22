const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../auth/auth.middleware");
const {
  categoryController,
  getAllCategory,
  updateCategoryController,
  deleteCategoryController,
  deleteAllCategoryController,
  singleCategoryController
} = require("./category.controller");
const {
  subCategoryController,
  getAllSubCategory,
  deleteAllSubCategory
} = require("../subcategory/subcategory.controller");
const { validateObjectIdParam } = require("../../common/middleware/requestValidation");
const {
  validateCategoryBody,
  validateSubCategoryBody,
} = require("./category.validators");

const adminOnly = [authMiddleware, adminMiddleware];

router.post("/createcategory", ...adminOnly, validateCategoryBody, categoryController);
router.get("/getallcategory", getAllCategory);
router.post("/createsubcategory", ...adminOnly, validateSubCategoryBody, subCategoryController);
router.get("/getallsubcategory", getAllSubCategory);
router.patch("/updatecategory/:id", ...adminOnly, validateObjectIdParam("id", "category id"), validateCategoryBody, updateCategoryController);
router.get("/singlecategory/:id", validateObjectIdParam("id", "category id"), singleCategoryController);
router.delete("/deletecategory/:id", ...adminOnly, validateObjectIdParam("id", "category id"), deleteCategoryController);
router.delete("/deleteallcategory", ...adminOnly, deleteAllCategoryController);
router.delete("/deleteallsubcategory", ...adminOnly, deleteAllSubCategory);

module.exports = router;
