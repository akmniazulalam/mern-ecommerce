const mongoose = require("mongoose");
const uploadImage = require("../../common/config/cloudinary");
const { ALLOWED_VARIANT_KEYS } = require("./product.validators");

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

function trimString(value) {
  if (value === undefined || value === null) return undefined;
  const trimmed = String(value).trim();
  return trimmed === "" ? undefined : trimmed;
}

function normalizeAttributes(attributes) {
  if (!attributes || typeof attributes !== "object") {
    return undefined;
  }

  if (attributes instanceof Map) {
    return attributes.size > 0 ? attributes : undefined;
  }

  const entries = Object.entries(attributes).filter(
    ([, value]) => value !== undefined && value !== null && String(value).trim() !== "",
  );

  if (entries.length === 0) {
    return undefined;
  }

  return new Map(entries.map(([key, value]) => [String(key).trim(), String(value).trim()]));
}

function normalizeImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter(Boolean);
}

/**
 * Maps client variant payload to a Mongoose-ready subdocument.
 * Strips client-only fields (image, imageUpdated, index).
 */
function normalizeVariantForSave(raw) {
  const variant = {};

  for (const key of ALLOWED_VARIANT_KEYS) {
    if (raw[key] === undefined) continue;

    if (key === "_id") {
      if (isValidObjectId(raw._id)) {
        variant._id = raw._id;
      }
      continue;
    }

    if (key === "attributes") {
      const attributes = normalizeAttributes(raw.attributes);
      if (attributes) {
        variant.attributes = attributes;
      }
      continue;
    }

    if (key === "images") {
      variant.images = normalizeImages(raw.images);
      continue;
    }

    if (key === "price" || key === "stock") {
      variant[key] = Number(raw[key]);
      continue;
    }

    if (key === "sku") {
      const sku = trimString(raw.sku);
      if (sku) {
        variant.sku = sku.toUpperCase();
      }
      continue;
    }

    const value = trimString(raw[key]);
    if (value !== undefined) {
      variant[key] = value;
    }
  }

  return variant;
}

function normalizeVariantsForSave(rawVariants) {
  return rawVariants.map((variant) => normalizeVariantForSave(variant));
}

function attachImagesToVariants(variants, imageUrls) {
  return variants.map((variant, index) => {
    const images = imageUrls[index]
      ? [imageUrls[index]]
      : normalizeImages(variant.images);

    return {
      ...variant,
      images,
    };
  });
}

async function uploadFiles(files) {
  const imageUrls = [];

  for (const file of files) {
    const uploaded = await uploadImage(file.path);
    imageUrls.push(uploaded.secure_url);
  }

  return imageUrls;
}

function normalizeImageIndexes(imageIndexes) {
  if (imageIndexes === undefined || imageIndexes === null) {
    return [];
  }

  return Array.isArray(imageIndexes) ? imageIndexes : [imageIndexes];
}

async function applyVariantImageUpdates(variants, files, imageIndexes) {
  if (!files || files.length === 0) {
    return variants;
  }

  const indexes = normalizeImageIndexes(imageIndexes);
  const updatedVariants = variants.map((variant) => ({
    ...variant,
    images: normalizeImages(variant.images),
  }));

  for (let i = 0; i < files.length; i++) {
    const variantIndex = Number(indexes[i]);

    if (
      Number.isNaN(variantIndex) ||
      !Number.isInteger(variantIndex) ||
      variantIndex < 0 ||
      variantIndex >= updatedVariants.length
    ) {
      const error = new Error("Invalid image index for variant update");
      error.status = 400;
      error.field = "imageIndexes";
      throw error;
    }

    const uploaded = await uploadImage(files[i].path);
    updatedVariants[variantIndex].images = [uploaded.secure_url];
  }

  return updatedVariants;
}

/**
 * Ensures attributes Map is plain object in API responses.
 */
function formatVariant(variant) {
  if (!variant) {
    return variant;
  }

  const plain = variant.toObject ? variant.toObject({ flattenMaps: true }) : { ...variant };

  if (plain.attributes instanceof Map) {
    plain.attributes = Object.fromEntries(plain.attributes);
  }

  return plain;
}

function formatProductResponse(product) {
  if (!product) {
    return null;
  }

  const doc = product.toObject ? product.toObject({ flattenMaps: true }) : product;

  if (Array.isArray(doc.variants)) {
    doc.variants = doc.variants.map((variant) => formatVariant(variant));
  }

  return doc;
}

function formatProductsResponse(products) {
  return products.map((product) => formatProductResponse(product));
}

module.exports = {
  normalizeVariantForSave,
  normalizeVariantsForSave,
  attachImagesToVariants,
  uploadFiles,
  applyVariantImageUpdates,
  formatProductResponse,
  formatProductsResponse,
};
