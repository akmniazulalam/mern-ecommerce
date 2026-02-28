const express = require("express");
const router = express.Router();
const {
  categoryController,
  getAllCategory,
  updateCategoryController,
  deleteCategoryController,
  deleteAllCategoryController
} = require("../../controllers/categoryController");
const {
  subCategoryController,
  getAllSubCategory,
  deleteAllSubCategory
} = require("../../controllers/subCategoryController");

router.post("/createcategory", categoryController);
router.get("/getallcategory", getAllCategory);
router.post("/createsubcategory", subCategoryController);
router.get("/getallsubcategory", getAllSubCategory);
router.patch("/updatecategory/:id", updateCategoryController);
router.delete("/deletecategory/:id", deleteCategoryController);
router.delete("/deleteallcategory", deleteAllCategoryController);
router.delete("/deleteallsubcategory", deleteAllSubCategory);

module.exports = router;
