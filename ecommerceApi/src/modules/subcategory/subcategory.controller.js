const subCategorySchema = require("./subcategory.model");
const categorySchema = require("../category/category.model");
const asyncHandler = require("../../common/middleware/asyncHandler");

const subCategoryController = asyncHandler(async (req, res) => {
  const { name, description, categoryId } = req.body;
  const existingSubCategory = await subCategorySchema.findOne({name})

  if(existingSubCategory){
    return res.json({message: "Already Exist"})
  }
  const createSubCategory = new subCategorySchema({
    name,
    description,
    categoryId,
  });
  await createSubCategory.save();

  await categorySchema.findOneAndUpdate({_id: categoryId}, { $push: {subcategorylist: createSubCategory._id}}, {new: true})

  res.status(200).json({ message: "Subcategory Added Successfully" });
});

const getAllSubCategory = asyncHandler(async (req, res) => {
  const getSubCategoryList = await subCategorySchema.find({});
  res.json({ message: "Subcategory Paichi", data: getSubCategoryList });
});

const deleteAllSubCategory = asyncHandler(async (req, res) => {
  const AllSubCategory = await subCategorySchema.deleteMany({})
  res.json({message: "Success", data: AllSubCategory})
});

module.exports = { subCategoryController, getAllSubCategory, deleteAllSubCategory };
