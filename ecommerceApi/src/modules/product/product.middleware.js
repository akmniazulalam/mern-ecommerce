const mongoose = require("mongoose");
const { sendError } = require("./product.errors");
const {
  parseVariantsJson,
  validateCreateImages,
  validateProductBasics,
  validateUpdateImages,
  validateVariants,
} = require("./product.validators");

function isValidProductId(id) {
  if (id === undefined || id === null || id === "") {
    return false;
  }

  return mongoose.Types.ObjectId.isValid(String(id));
}

function validateProductIdParam(req, res, next) {
  if (!isValidProductId(req.params.id)) {
    return sendError(res, {
      status: 400,
      message: "Invalid product id",
    });
  }

  return next();
}

function validateProductCreateRequest(req, res, next) {
  const { name, description, category, variants } = req.body || {};

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

  return next();
}

function validateProductUpdateRequest(req, res, next) {
  const { name, description, category, variants } = req.body || {};

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

  return next();
}

function parsePositiveInteger(value, field, options = {}) {
  if (value === undefined || value === null || value === "") {
    return { value: undefined };
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return {
      error: {
        status: 400,
        field,
        message: `${field} must be a positive integer`,
      },
    };
  }

  if (options.max && parsed > options.max) {
    return {
      error: {
        status: 400,
        field,
        message: `${field} cannot be greater than ${options.max}`,
      },
    };
  }

  return { value: parsed };
}

function parseNonNegativeNumber(value, field) {
  if (value === undefined || value === null || value === "") {
    return { value: undefined };
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return {
      error: {
        status: 400,
        field,
        message: `${field} must be a non-negative number`,
      },
    };
  }

  return { value: parsed };
}

function normalizeSort(value) {
  if (value === undefined || value === null || value === "") {
    return "latest";
  }

  const normalized = String(value).trim().toLowerCase();
  const aliases = {
    latest: "latest",
    newest: "latest",
    "-createdat": "latest",
    createdatdesc: "latest",
    "createdat-desc": "latest",
    oldest: "oldest",
    createdatasc: "oldest",
    "createdat-asc": "oldest",
    name: "name-asc",
    nameasc: "name-asc",
    "name-asc": "name-asc",
    name_desc: "name-desc",
    namedesc: "name-desc",
    "name-desc": "name-desc",
    "-name": "name-desc",
    price: "price-asc",
    priceasc: "price-asc",
    "price-asc": "price-asc",
    price_asc: "price-asc",
    lowtohigh: "price-asc",
    "low-to-high": "price-asc",
    pricedesc: "price-desc",
    "price-desc": "price-desc",
    price_desc: "price-desc",
    "-price": "price-desc",
    hightolow: "price-desc",
    "high-to-low": "price-desc",
    stock: "stock-desc",
    stockdesc: "stock-desc",
    "stock-desc": "stock-desc",
    stock_desc: "stock-desc",
    stockasc: "stock-asc",
    "stock-asc": "stock-asc",
    stock_asc: "stock-asc",
  };

  return aliases[normalized] || null;
}

function normalizeStock(value) {
  if (value === undefined || value === null || value === "") {
    return { value: undefined };
  }

  const normalized = String(value).trim().toLowerCase();

  if (normalized === "all") {
    return { value: undefined };
  }

  if (["in", "instock", "in-stock", "available", "true"].includes(normalized)) {
    return { value: "in-stock" };
  }

  if (["out", "outofstock", "out-of-stock", "unavailable", "false"].includes(normalized)) {
    return { value: "out-of-stock" };
  }

  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed >= 0) {
    return { value: parsed };
  }

  return {
    error: {
      status: 400,
      field: "stock",
      message: "stock must be in-stock, out-of-stock, all, true, false, or a non-negative integer",
    },
  };
}

function firstQueryValue(query, keys) {
  for (const key of keys) {
    if (query[key] !== undefined) {
      return query[key];
    }
  }

  return undefined;
}

function validateProductListQuery(req, res, next) {
  const query = req.query || {};

  const pageResult = parsePositiveInteger(query.page, "page");
  if (pageResult.error) return sendError(res, pageResult.error);

  const limitResult = parsePositiveInteger(query.limit, "limit", { max: 100 });
  if (limitResult.error) return sendError(res, limitResult.error);

  const minPriceResult = parseNonNegativeNumber(
    firstQueryValue(query, ["minPrice", "min_price", "minprice"]),
    "minPrice",
  );
  if (minPriceResult.error) return sendError(res, minPriceResult.error);

  const maxPriceResult = parseNonNegativeNumber(
    firstQueryValue(query, ["maxPrice", "max_price", "maxprice"]),
    "maxPrice",
  );
  if (maxPriceResult.error) return sendError(res, maxPriceResult.error);

  if (
    minPriceResult.value !== undefined &&
    maxPriceResult.value !== undefined &&
    minPriceResult.value > maxPriceResult.value
  ) {
    return sendError(res, {
      status: 400,
      field: "maxPrice",
      message: "maxPrice must be greater than or equal to minPrice",
    });
  }

  const sort = normalizeSort(query.sort);
  if (!sort) {
    return sendError(res, {
      status: 400,
      field: "sort",
      message: "Unsupported product sort option",
    });
  }

  const stockResult = normalizeStock(query.stock);
  if (stockResult.error) return sendError(res, stockResult.error);

  const search = query.search === undefined ? "" : String(query.search).trim();
  if (search.length > 100) {
    return sendError(res, {
      status: 400,
      field: "search",
      message: "search cannot be longer than 100 characters",
    });
  }

  const category = query.category === undefined ? "" : String(query.category).trim();
  if (category.length > 100) {
    return sendError(res, {
      status: 400,
      field: "category",
      message: "category cannot be longer than 100 characters",
    });
  }

  const hasPagination = pageResult.value !== undefined || limitResult.value !== undefined;

  req.productListQuery = {
    page: pageResult.value || 1,
    limit: limitResult.value || (hasPagination ? 12 : undefined),
    hasPagination,
    search,
    category,
    sort,
    minPrice: minPriceResult.value,
    maxPrice: maxPriceResult.value,
    stock: stockResult.value,
  };

  return next();
}

module.exports = {
  isValidProductId,
  validateProductListQuery,
  validateProductIdParam,
  validateProductCreateRequest,
  validateProductUpdateRequest,
};
