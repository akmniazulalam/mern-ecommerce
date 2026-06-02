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
  if (!variants.length) {
    return null;
  }

  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => !Number.isNaN(price));

  if (!prices.length) {
    return null;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return `$${min.toFixed(2)}`;
  }

  return `$${min.toFixed(2)} – $${max.toFixed(2)}`;
}

export function getTotalStock(variants = []) {
  return variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
}
