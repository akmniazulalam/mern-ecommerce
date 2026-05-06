const cloudinary = require("cloudinary").v2;
const uploadImage = require("../../common/config/cloudinary");
const productSchema = require("./product.model");

async function productController(req, res) {
  const { name, description, category, variants } = req.body;

  const imageUrls = [];

  const parseVariants = JSON.parse(variants);

  if (!req.files || req.files.length === 0) {
    res.status(400).json({message: "Image is required"})
  }
  
  for (let file of req.files) {
    const uploaded = await uploadImage(file.path);
    imageUrls.push(uploaded.secure_url);
  }
  
  if (imageUrls.length !== parseVariants.length) {
    return res.status(400).json({message: "Each variant must have one image."})
  }

  parseVariants.forEach((variant, index) => {
    variant.images = [imageUrls[index]];
  });

  const createProduct = new productSchema({
    name,
    description,
    category,
    variants: parseVariants,
  });


  await createProduct.save();
  res.json({
    message: "Product Added Successfully",
    data: createProduct,
  });
}

async function getProductController(req, res) {
  const getProduct = await productSchema.find({});
  res.json({
    message: "Success",
    data: getProduct,
  });
}

async function updateProductController(req, res) {
  const { id } = req.params;
  const { name, description, category, price, size, color, ram, storage } =
    req.body;
  const updateProduct = await productSchema.findById(id);
  updateProduct.name = name;
  updateProduct.description = description;
  updateProduct.category = category;
  updateProduct.price = price;
  updateProduct.size = size;
  updateProduct.color = color;
  updateProduct.ram = ram;
  updateProduct.storage = storage;

  if (req.file) {
    const oldImg = updateProduct.image;
    const publicId = oldImg.split("/").slice(-1)[0].split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    const imagePath = req.file.path;
    const imageUrl = await uploadImage(imagePath);

    updateProduct.image = imageUrl.secure_url;
  }

  await updateProduct.save();

  res.json({
    message: "Success",
    data: updateProduct,
  });
}

async function getSingleProductController(req, res) {
  const { id } = req.params;
  const singleProduct = await productSchema.findById(id);

  res.status(200).send({
    message: "Success",
    data: singleProduct,
  });
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  const deleteProduct = await productSchema.findByIdAndDelete(id);

  res.json({
    message: "Successfully deleted",
    data: deleteProduct,
  });
}

async function deleteAllProduct(req, res) {
  const deleteAllProduct = await productSchema.deleteMany({});
  res.json({
    message: "Successfully deleted",
    data: deleteAllProduct,
  });
}

module.exports = {
  productController,
  updateProductController,
  getProductController,
  getSingleProductController,
  deleteProduct,
  deleteAllProduct,
};
