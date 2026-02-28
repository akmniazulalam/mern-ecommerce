const subCategorySchema = require("../model/subCategorySchema");
const categorySchema = require("../model/categorySchema");

async function subCategoryController(req, res) {
  const { name, description, categoryId } = req.body;
  try {
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

    const updatedCategory = await categorySchema.findOneAndUpdate({_id: categoryId}, { $push: {subcategorylist: createSubCategory._id}}, {new: true})

    res.status(200).json({ message: "Subcategory Added Successfully" });
  } catch (error) {
    return res.json({ message: "error" });
  }
}

async function getAllSubCategory(req, res) {
  const getCategoryList = await subCategorySchema.find({});
  res.json({ message: "Category Paichi", data: getCategoryList });
}

async function deleteAllSubCategory (req, res) {
  const AllSubCategory = await subCategorySchema.deleteMany({})
  res.json({message: "Success", data: AllSubCategory})
}

module.exports = { subCategoryController, getAllSubCategory, deleteAllSubCategory };
