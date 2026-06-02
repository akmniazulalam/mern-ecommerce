import apiClient from "@/lib/apiClient";
import { productPaths, unwrapApiData } from "@/lib/productApi";
import {
  buildProductFormData,
  normalizeProductFromApi,
  normalizeVariantFromApi,
} from "@/lib/productVariants";

export async function fetchCategories() {
  const response = await apiClient.get(productPaths.categories);
  return unwrapApiData(response) ?? [];
}

export async function fetchProducts() {
  const response = await apiClient.get(productPaths.list);
  const products = unwrapApiData(response) ?? [];
  return products.map(normalizeProductFromApi);
}

export async function fetchProductById(id) {
  const response = await apiClient.get(productPaths.single(id));
  return normalizeProductFromApi(unwrapApiData(response));
}

export async function fetchProductVariants(id) {
  const response = await apiClient.get(productPaths.variants(id));
  const variants = unwrapApiData(response) ?? [];
  return variants.map(normalizeVariantFromApi);
}

export async function createProduct({ name, description, category, variants }) {
  const formData = buildProductFormData(
    { name, description, category, variants },
    "create",
  );

  const response = await apiClient.post(productPaths.create, formData);

  return normalizeProductFromApi(unwrapApiData(response));
}

export async function updateProduct(id, { name, description, category, variants }) {
  const formData = buildProductFormData(
    { name, description, category, variants },
    "update",
  );

  const response = await apiClient.patch(productPaths.update(id), formData);

  return normalizeProductFromApi(unwrapApiData(response));
}

export async function deleteProduct(id) {
  const response = await apiClient.delete(productPaths.delete(id));
  return normalizeProductFromApi(unwrapApiData(response));
}

export async function addVariantToCart(product, variant) {
  const payload = {
    productId: product._id,
    variantId: variant._id,
    name: product.name,
    image: variant.images?.[0],
    color: variant.color,
    size: variant.size,
    ram: variant.ram,
    storage: variant.storage,
    price: variant.price,
    badge: variant.badge,
    sku: variant.sku,
  };

  const response = await apiClient.post(productPaths.addToCart, payload);
  return response.data;
}
