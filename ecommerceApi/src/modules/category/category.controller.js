const categorySchema = require("./category.model");
const asyncHandler = require("../../common/middleware/asyncHandler");

const categoryController = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const createCategory = new categorySchema({
    name,
    description,
  });
  await createCategory.save();

  res.status(200).json({ message: "Category Added Successfully" });
});

const getAllCategory = asyncHandler(async (req, res) => {
  const getCategoryList = await categorySchema
    .find({})
    .populate("subcategorylist"); //ei populate diye shudhu matro response ei subcategory er data dekha jabe. db te subcategory er id chara ar kichu dekha jabena
  res.json({ message: "Category Paichi", data: getCategoryList });
});

const updateCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updateCategory = await categorySchema.findById(id);

  updateCategory.name = name;
  updateCategory.description = description;

  await updateCategory.save();
  res.status(200).json({
    message: "Success",
    data: updateCategory,
  });
});

const singleCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const singleCategory = await categorySchema.findById(id);

  res.status(200).send({
    message: "Success",
    data: singleCategory,
  });
});

const deleteCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteCategory = await categorySchema.findByIdAndDelete(id);
  res.status(200).json({
    message: "Success",
    data: deleteCategory,
  });
});

const deleteAllCategoryController = asyncHandler(async (req, res) => {
  const deleteAllCategory = await categorySchema.deleteMany({});
  res.status(200).json({
    message: "Success",
    data: deleteAllCategory,
  });
});

module.exports = {
  categoryController,
  getAllCategory,
  updateCategoryController,
  deleteCategoryController,
  deleteAllCategoryController,
  singleCategoryController,
};
