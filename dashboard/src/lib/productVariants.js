export function createEmptyVariant() {
  return {
    clientKey: crypto.randomUUID(),
    sku: "",
    color: "",
    size: "",
    ram: "",
    storage: "",
    stock: "",
    price: "",
    salePrice: undefined,
    saleStartDate: undefined,
    saleEndDate: undefined,
    attributes: {},
    badge: "",
    image: null,
    images: [],
  };
}

export function normalizeVariantFromApi(variant = {}) {
  return {
    _id: variant._id,
    sku: variant.sku ?? "",
    color: variant.color ?? "",
    size: variant.size ?? "",
    ram: variant.ram ?? "",
    storage: variant.storage ?? "",
    badge: variant.badge ?? "",
    price: variant.price ?? "",
    salePrice: variant.salePrice ?? undefined,
    saleStartDate: variant.saleStartDate ?? undefined,
    saleEndDate: variant.saleEndDate ?? undefined,
    stock: variant.stock ?? "",
    images: Array.isArray(variant.images) ? variant.images : [],
    attributes:
      variant.attributes && typeof variant.attributes === "object"
        ? variant.attributes
        : {},
  };
}

export function normalizeProductFromApi(product) {
  if (!product) {
    return null;
  }

  return {
    ...product,
    variants: (product.variants ?? []).map(normalizeVariantFromApi),
  };
}

export function mapApiVariantsToForm(apiVariants = []) {
  if (!apiVariants.length) {
    return [createEmptyVariant()];
  }

  return apiVariants.map((variant) => {
    const normalized = normalizeVariantFromApi(variant);

    return {
      ...createEmptyVariant(),
      ...normalized,
      price: normalized.price === "" ? "" : String(normalized.price),
      salePrice: normalized.salePrice === "" ? "" : String(normalized.salePrice),
      saleStartDate: normalized.saleStartDate || undefined,
      saleEndDate: normalized.saleEndDate || undefined,
      stock: normalized.stock === "" ? "" : String(normalized.stock),
      clientKey: normalized._id || crypto.randomUUID(),
      image: null,
      imageUpdated: false,
    };
  });
}

export function buildProductFormData({ name, description, category, variants }, mode = "create") {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("variants", JSON.stringify(buildVariantPayload(variants)));

  if (mode === "create") {
    variants.forEach((variant) => {
      if (variant.image instanceof File) {
        formData.append("images", variant.image);
      }
    });
  } else {
    variants.forEach((variant, index) => {
      if (variant.image instanceof File) {
        formData.append("images", variant.image);
        formData.append("imageIndexes", String(index));
      }
    });
  }

  return formData;
}

export function buildVariantPayload(variants) {
  return variants.map((variant) => {
    const payload = {
      color: variant.color ?? "",
      size: variant.size ?? "",
      ram: variant.ram ?? "",
      storage: variant.storage ?? "",
      stock: variant.stock,
      price: variant.price,
      salePrice: variant.salePrice ?? undefined,
      saleStartDate: variant.saleStartDate ?? undefined,
      saleEndDate: variant.saleEndDate ?? undefined,
      badge: variant.badge ?? "",
    };

    if (variant.sku?.trim()) {
      payload.sku = variant.sku.trim();
    }

    if (variant._id) {
      payload._id = variant._id;
    }

    if (Array.isArray(variant.images) && variant.images.length > 0) {
      payload.images = variant.images;
    }

    if (variant.attributes && Object.keys(variant.attributes).length > 0) {
      payload.attributes = variant.attributes;
    }

    return payload;
  });
}

export function validateVariantsBeforeSubmit(variants, { isCreate = false } = {}) {
  if (!variants?.length) {
    return "Add at least one variant.";
  }

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const label = `Variant ${i + 1}`;

    if (variant.price === "" || variant.price === undefined || Number.isNaN(Number(variant.price))) {
      return `${label}: price is required.`;
    }

    if (Number(variant.price) < 0) {
      return `${label}: price cannot be negative.`;
    }

    if (variant.salePrice !== undefined && (variant.salePrice === "" || Number.isNaN(Number(variant.salePrice)))) {
      return `${label}: sale price is invalid.`;
    }

    if (variant.salePrice !== undefined && Number(variant.salePrice) < 0) {
      return `${label}: sale price cannot be negative.`;
    }

    if (variant.saleStartDate !== undefined && !variant.saleStartDate) {
      return `${label}: sale start date is invalid.`;
    }

    if (variant.saleEndDate !== undefined && !variant.saleEndDate) {
      return `${label}: sale end date is invalid.`;
    }

    if (variant.saleStartDate && variant.saleEndDate && new Date(variant.saleStartDate) > new Date(variant.saleEndDate)) {
      return `${label}: sale start date cannot be after sale end date.`;
    }

    if (variant.stock === "" || variant.stock === undefined || Number.isNaN(Number(variant.stock))) {
      return `${label}: stock is required.`;
    }

    if (Number(variant.stock) < 1) {
      return `${label}: stock must be at least 1.`;
    }

    if (isCreate && !(variant.image instanceof File)) {
      return `${label}: image is required.`;
    }

    if (!isCreate && !variant.images?.[0] && !(variant.image instanceof File)) {
      return `${label}: image is required (upload or keep existing).`;
    }
  }

  return null;
}

export function getVariantSummary(variant) {
  const parts = [variant.color, variant.size].filter(Boolean);

  if (variant.sku) {
    parts.push(`SKU: ${variant.sku}`);
  }

  if (variant.ram) {
    parts.push(variant.ram);
  }

  if (variant.storage) {
    parts.push(variant.storage);
  }

  return parts.length ? parts.join(" · ") : "Default variant";
}

export function getProductPriceRange(variants = []) {
  if (!Array.isArray(variants) || variants.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
    };
  }

  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));

  if (prices.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
    };
  }

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
}

export function getTotalStock(variants = []) {
  return variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
}
