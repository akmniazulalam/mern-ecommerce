const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl) {
  throw new Error("Missing required environment variable: VITE_API_URL");
}

export const API_BASE_URL = apiBaseUrl;

export const productPaths = {
  list: "/product/getproduct",
  create: "/product/createproduct",
  single: (id) => `/product/singleproduct/${id}`,
  update: (id) => `/product/updateproduct/${id}`,
  delete: (id) => `/product/deleteproduct/${id}`,
  variants: (id) => `/product/${id}/variants`,
  categories: "/category/getallcategory",
};

export const authPaths = {
  signup: "/auth/signup",
  otpVerify: "/auth/otpverify",
  resendOtp: "/auth/resendotp",
  userList: "/auth/userlist",
  deleteUser: (id) => `/auth/deleteuser/${id}`,
};

export const categoryPaths = {
  create: "/category/createcategory",
  list: "/category/getallcategory",
  single: (id) => `/category/singlecategory/${id}`,
  update: (id) => `/category/updatecategory/${id}`,
  delete: (id) => `/category/deletecategory/${id}`,
};

export const couponPaths = {
  create: "/coupon/create-coupon",
  list: "/coupon/couponlist",
  delete: (id) => `/coupon/deletecoupon/${id}`,
};

export function unwrapApiData(response) {
  return response?.data?.data ?? null;
}

export function unwrapApiMessage(response) {
  return response?.data?.message ?? "";
}
