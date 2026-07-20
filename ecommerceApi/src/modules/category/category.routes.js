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

const adminOnly = [authMiddleware, adminMiddleware];

router.post("/createcategory", ...adminOnly, categoryController);
router.get("/getallcategory", getAllCategory);
router.post("/createsubcategory", ...adminOnly, subCategoryController);
router.get("/getallsubcategory", getAllSubCategory);
router.patch("/updatecategory/:id", ...adminOnly, updateCategoryController);
router.get("/singlecategory/:id", singleCategoryController);
router.delete("/deletecategory/:id", ...adminOnly, deleteCategoryController);
router.delete("/deleteallcategory", ...adminOnly, deleteAllCategoryController);
router.delete("/deleteallsubcategory", ...adminOnly, deleteAllSubCategory);

module.exports = router;
