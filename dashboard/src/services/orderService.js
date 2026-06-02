import apiClient from "@/lib/apiClient";
import { unwrapApiData } from "@/lib/productApi";

const orderPaths = {
  adminList: "/order/admin",
  updateStatus: (id) => `/order/${id}/status`,
};

export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export async function fetchAdminOrders({ status } = {}) {
  const params = {};
  if (status && status !== "all") {
    params.status = status;
  }

  const response = await apiClient.get(orderPaths.adminList, { params });
  return unwrapApiData(response) ?? [];
}

export async function updateOrderStatus(orderId, status) {
  const response = await apiClient.patch(orderPaths.updateStatus(orderId), { status });
  return unwrapApiData(response);
}

