export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://mern-ecommerce-91cv.onrender.com/api/v1";

/** Legacy paths (dashboard contract) — matches backend routes */
export const productPaths = {
  list: "/product/getproduct",
  create: "/product/createproduct",
  single: (id) => `/product/singleproduct/${id}`,
  update: (id) => `/product/updateproduct/${id}`,
  delete: (id) => `/product/deleteproduct/${id}`,
  variants: (id) => `/product/${id}/variants`,
  categories: "/category/getallcategory",
  addToCart: "/cart/addtocart",
};

/** @deprecated Use productPaths — kept for any remaining imports */
export const productEndpoints = {
  list: `${API_BASE_URL}${productPaths.list}`,
  create: `${API_BASE_URL}${productPaths.create}`,
  single: (id) => `${API_BASE_URL}${productPaths.single(id)}`,
  update: (id) => `${API_BASE_URL}${productPaths.update(id)}`,
  delete: (id) => `${API_BASE_URL}${productPaths.delete(id)}`,
  categories: `${API_BASE_URL}${productPaths.categories}`,
};

export function unwrapApiData(response) {
  return response?.data?.data ?? null;
}

export function unwrapApiMessage(response) {
  return response?.data?.message ?? "";
}
