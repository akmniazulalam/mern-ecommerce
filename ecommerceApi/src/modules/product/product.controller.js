const Product = require("./product.model");
const { sendError, handleMongoError } = require("./product.errors");
const {
  parseVariantsJson,
  validateProductBasics,
  validateVariants,
  validateCreateImages,
  validateUpdateImages,
  toTrimmedString,
} = require("./product.validators");
const {
  normalizeVariantsForSave,
  attachImagesToVariants,
  uploadFiles,
  applyVariantImageUpdates,
  formatProductResponse,
  formatProductsResponse,
} = require("./product.variant.utils");

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSort(sort) {
  const sortMap = {
    latest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    "name-asc": { name: 1, _id: 1 },
    "name-desc": { name: -1, _id: -1 },
    "price-asc": { minVariantPrice: 1, createdAt: -1, _id: -1 },
    "price-desc": { maxVariantPrice: -1, createdAt: -1, _id: -1 },
    "stock-asc": { totalVariantStock: 1, createdAt: -1, _id: -1 },
    "stock-desc": { totalVariantStock: -1, createdAt: -1, _id: -1 },
  };

  return sortMap[sort] || sortMap.latest;
}

function buildProductListFilter(query) {
  const filter = {};

  if (query.search) {
    const searchRegex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
      { "variants.sku": searchRegex },
      { "variants.color": searchRegex },
      { "variants.size": searchRegex },
      { "variants.badge": searchRegex },
    ];
  }

  if (query.category) {
    filter.category = new RegExp(`^${escapeRegex(query.category)}$`, "i");
  }

  const variantCriteria = {};

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    variantCriteria.price = {};

    if (query.minPrice !== undefined) {
      variantCriteria.price.$gte = query.minPrice;
    }

    if (query.maxPrice !== undefined) {
      variantCriteria.price.$lte = query.maxPrice;
    }
  }

  if (query.stock === "in-stock") {
    variantCriteria.stock = { $gt: 0 };
  } else if (query.stock === "out-of-stock") {
    variantCriteria.stock = { $lte: 0 };
  } else if (typeof query.stock === "number") {
    variantCriteria.stock = { $gte: query.stock };
  }

  if (Object.keys(variantCriteria).length > 0) {
    filter.variants = { $elemMatch: variantCriteria };
  }

  return filter;
}

async function productController(req, res) {
  try {
    const { name, description, category, variants } = req.body;

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

    const imageUrls = await uploadFiles(req.files);
    const normalizedVariants = normalizeVariantsForSave(parsed.data);
    const variantsWithImages = attachImagesToVariants(normalizedVariants, imageUrls);

    const product = new Product({
      name: toTrimmedString(name),
      description: toTrimmedString(description),
      category: toTrimmedString(category),
      variants: variantsWithImages,
    });

    await product.save();

    return res.json({
      message: "Product Added Successfully",
      data: formatProductResponse(product),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getProductController(req, res) {
  try {
    const listQuery = req.productListQuery || {
      page: 1,
      limit: undefined,
      hasPagination: false,
      sort: "latest",
    };
    const filter = buildProductListFilter(listQuery);
    const total = await Product.countDocuments(filter);
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          minVariantPrice: { $ifNull: [{ $min: "$variants.price" }, 0] },
          maxVariantPrice: { $ifNull: [{ $max: "$variants.price" }, 0] },
          totalVariantStock: { $ifNull: [{ $sum: "$variants.stock" }, 0] },
        },
      },
      { $sort: buildSort(listQuery.sort) },
    ];

    if (listQuery.hasPagination) {
      pipeline.push({ $skip: (listQuery.page - 1) * listQuery.limit });
      pipeline.push({ $limit: listQuery.limit });
    }

    pipeline.push({
      $project: {
        minVariantPrice: 0,
        maxVariantPrice: 0,
        totalVariantStock: 0,
      },
    });

    const products = await Product.aggregate(pipeline).collation({
      locale: "en",
      strength: 2,
    });

    return res.json({
      message: "Success",
      data: formatProductsResponse(products),
      meta: {
        page: listQuery.hasPagination ? listQuery.page : 1,
        limit: listQuery.hasPagination ? listQuery.limit : total,
        total,
        totalPages: listQuery.hasPagination
          ? Math.max(1, Math.ceil(total / listQuery.limit))
          : 1,
        hasNextPage: listQuery.hasPagination
          ? listQuery.page * listQuery.limit < total
          : false,
        hasPrevPage: listQuery.hasPagination ? listQuery.page > 1 : false,
        filters: {
          search: listQuery.search || "",
          category: listQuery.category || "",
          sort: listQuery.sort || "latest",
          minPrice: listQuery.minPrice ?? null,
          maxPrice: listQuery.maxPrice ?? null,
          stock: listQuery.stock ?? "all",
        },
      },
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getSingleProductController(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: formatProductResponse(product),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function updateProductController(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, variants } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

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

    let normalizedVariants = normalizeVariantsForSave(parsed.data);
    normalizedVariants = await applyVariantImageUpdates(
      normalizedVariants,
      req.files,
      req.body.imageIndexes,
    );

    product.name = toTrimmedString(name);
    product.description = toTrimmedString(description);
    product.category = toTrimmedString(category);
    product.variants = normalizedVariants;

    await product.save();

    return res.json({
      message: "Product updated successfully",
      data: formatProductResponse(product),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

    return res.json({
      message: "Successfully deleted",
      data: formatProductResponse(deleted),
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function deleteAllProduct(req, res) {
  try {
    const result = await Product.deleteMany({});

    return res.json({
      message: "Successfully deleted",
      data: result,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getProductVariantsController(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select("name variants");

    if (!product) {
      return sendError(res, {
        status: 404,
        message: "Product not found",
      });
    }

    const formatted = formatProductResponse(product);

    return res.status(200).json({
      message: "Success",
      data: formatted.variants,
      meta: {
        productId: formatted._id,
        productName: formatted.name,
        variantCount: formatted.variants?.length ?? 0,
      },
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

module.exports = {
  productController,
  updateProductController,
  getProductController,
  getSingleProductController,
  getProductVariantsController,
  deleteProduct,
  deleteAllProduct,
};
