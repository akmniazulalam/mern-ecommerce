const cloudinary = require("cloudinary").v2;
const uploadImage = require("../../common/config/cloudinary");
const productSchema = require("./product.model");

async function productController(req, res) {
  const { name, description, category, variants } = req.body;

  if (!name && !description && !category && !variants) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (!name) {
    return res.status(400).json({
      field: "name",
      message: "Product name is required",
    });
  }

  if (!description) {
    return res.status(400).json({
      field: "description",
      message: "Description is required",
    });
  }

  if (!category) {
    return res.status(400).json({
      field: "category",
      message: "Category is required",
    });
  }

  if (!variants) {
    return res.status(400).json({
      field: "variants",
      message: "Variants are required",
    });
  }

  const imageUrls = [];

  const parseVariants = JSON.parse(variants);

  if (!parseVariants.length) {
    return res.status(400).json({
      message: "At least one variant is required",
    });
  }

  for (let i = 0; i < parseVariants.length; i++) {
    const v = parseVariants[i];

    if (!v.price) {
      return res.status(400).json({
        field: `variants[${i}].price`,
        message: "Price is required",
      });
    }

    if (!v.stock || v.stock < 1) {
      return res.status(400).json({
        field: `variants[${i}].stock`,
        message: "Stock must be at least 1",
      });
    }
  }

  if (!req.files || req.files.length === 0) {
    res.status(400).json({ message: "Image is required" });
  }

  for (let file of req.files) {
    const uploaded = await uploadImage(file.path);
    imageUrls.push(uploaded.secure_url);
  }

  if (imageUrls.length !== parseVariants.length) {
    return res
      .status(400)
      .json({ message: "Each variant must have one image." });
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
  try {
    const { id } = req.params;
    const { name, description, category, variants } = req.body;

    const imageIndexes = req.body.imageIndexes;

    const indexes = Array.isArray(imageIndexes) ? imageIndexes : [imageIndexes];

    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // =========================
    // BASIC FIELDS
    // =========================
    product.name = name;
    product.description = description;
    product.category = category;

    // =========================
    // VARIANTS PARSE
    // =========================
    let parsedVariants = JSON.parse(variants);

    // =========================
    // IMAGE HANDLING (MULTI)
    // =========================
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        const uploaded = await uploadImage(file.path);

        const variantIndex = indexes[i];

        parsedVariants[variantIndex].images = [uploaded.secure_url];
      }
    }

    // =========================
    // ASSIGN VARIANTS
    // =========================
    product.variants = parsedVariants;

    await product.save();

    res.json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
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
