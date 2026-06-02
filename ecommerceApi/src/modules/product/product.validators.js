const ALLOWED_VARIANT_KEYS = new Set([
  "_id",
  "sku",
  "size",
  "color",
  "price",
  "stock",
  "images",
  "badge",
  "ram",
  "storage",
  "attributes",
]);

function parseVariantsJson(variantsPayload) {
  if (
    variantsPayload === undefined ||
    variantsPayload === null ||
    variantsPayload === ""
  ) {
    return {
      error: {
        status: 400,
        field: "variants",
        message: "Variants are required",
      },
    };
  }

  let parsed;

  if (typeof variantsPayload === "string") {
    try {
      parsed = JSON.parse(variantsPayload);
    } catch {
      return {
        error: {
          status: 400,
          message: "Invalid variants JSON",
        },
      };
    }
  } else if (Array.isArray(variantsPayload)) {
    parsed = variantsPayload;
  } else {
    return {
      error: {
        status: 400,
        message: "Variants must be an array",
      },
    };
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return {
      error: {
        status: 400,
        message: "At least one variant is required",
      },
    };
  }

  return { data: parsed };
}

function toTrimmedString(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function validateProductBasics({ name, description, category }) {
  if (!toTrimmedString(name)) {
    return {
      status: 400,
      field: "name",
      message: "Product name is required",
    };
  }

  if (!toTrimmedString(description)) {
    return {
      status: 400,
      field: "description",
      message: "Description is required",
    };
  }

  if (!toTrimmedString(category)) {
    return {
      status: 400,
      field: "category",
      message: "Category is required",
    };
  }

  return null;
}

function validateUpdateImages(files, imageIndexes) {
  if (!files || files.length === 0) {
    return null;
  }

  const indexes =
    imageIndexes === undefined || imageIndexes === null
      ? []
      : Array.isArray(imageIndexes)
        ? imageIndexes
        : [imageIndexes];

  if (indexes.length !== files.length) {
    return {
      status: 400,
      field: "imageIndexes",
      message: "Each uploaded image must include a matching imageIndexes entry",
    };
  }

  return null;
}

function validateVariantEntry(variant, index, options = {}) {
  const { requireStockMinOne = true } = options;
  const prefix = `variants[${index}]`;

  const price = Number(variant.price);
  if (variant.price === undefined || variant.price === "" || Number.isNaN(price)) {
    return {
      field: `${prefix}.price`,
      message: "Price is required",
    };
  }

  if (price < 0) {
    return {
      field: `${prefix}.price`,
      message: "Price cannot be negative",
    };
  }

  const stock = Number(variant.stock);
  if (variant.stock === undefined || variant.stock === "" || Number.isNaN(stock)) {
    return {
      field: `${prefix}.stock`,
      message: "Stock is required",
    };
  }

  if (requireStockMinOne && stock < 1) {
    return {
      field: `${prefix}.stock`,
      message: "Stock must be at least 1",
    };
  }

  if (stock < 0) {
    return {
      field: `${prefix}.stock`,
      message: "Stock cannot be negative",
    };
  }

  if (variant.sku !== undefined && variant.sku !== null && String(variant.sku).trim() === "") {
    return {
      field: `${prefix}.sku`,
      message: "SKU cannot be empty when provided",
    };
  }

  return null;
}

function validateVariants(variants, options = {}) {
  const skus = new Set();

  for (let i = 0; i < variants.length; i++) {
    const variantError = validateVariantEntry(variants[i], i, options);
    if (variantError) {
      return { status: 400, ...variantError };
    }

    const sku = variants[i].sku;
    if (sku) {
      const normalizedSku = String(sku).trim().toUpperCase();
      if (skus.has(normalizedSku)) {
        return {
          status: 400,
          field: `variants[${i}].sku`,
          message: "Duplicate SKU in request",
        };
      }
      skus.add(normalizedSku);
    }
  }

  return null;
}

function validateCreateImages(files, variantCount) {
  if (!files || files.length === 0) {
    return {
      status: 400,
      message: "Image is required",
    };
  }

  if (files.length !== variantCount) {
    return {
      status: 400,
      message: "Each variant must have one image.",
    };
  }

  return null;
}

module.exports = {
  ALLOWED_VARIANT_KEYS,
  parseVariantsJson,
  validateProductBasics,
  validateVariantEntry,
  validateVariants,
  validateCreateImages,
  validateUpdateImages,
  toTrimmedString,
};
