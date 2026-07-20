import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiErrorMessage } from "@/lib/apiErrors";
import {
  fetchAdminOrders,
  ORDER_STATUSES,
  updateOrderStatus,
} from "@/services/orderService";
import {
  AlertCircle,
  Eye,
  Loader2,
  RefreshCw,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const CURRENCY_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatMoney(amount, currency = "USD") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "-";

  if (currency === "USD") {
    return CURRENCY_FORMAT.format(value);
  }

  return `${value.toFixed(2)} ${currency}`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Pending":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30";
    case "Processing":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30";
    case "Shipped":
      return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30";
    case "Delivered":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30";
    case "Cancelled":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [draftStatus, setDraftStatus] = useState("");
  const [isStatusSaving, setIsStatusSaving] = useState(false);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await fetchAdminOrders({
        status: statusFilter,
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setOrders([]);
      setLoadError(getApiErrorMessage(error, "Failed to load orders"));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const totalOrders = orders.length;
  const deliveredCount = useMemo(
    () => orders.filter((order) => order.orderStatus === "Delivered").length,
    [orders],
  );
  const pendingCount = useMemo(
    () =>
      orders.filter((order) => ["Pending", "Processing", "Shipped"].includes(order.orderStatus))
        .length,
    [orders],
  );

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDraftStatus(order.orderStatus);
    setDetailsOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || !draftStatus || draftStatus === selectedOrder.orderStatus) {
      return;
    }

    setIsStatusSaving(true);
    try {
      const updated = await updateOrderStatus(selectedOrder._id, draftStatus);
      const safeUpdated = updated || { ...selectedOrder, orderStatus: draftStatus };

      setOrders((prev) =>
        prev.map((order) => (order._id === selectedOrder._id ? safeUpdated : order)),
      );
      setSelectedOrder(safeUpdated);
      setDraftStatus(safeUpdated.orderStatus);
      toast.success("Order status updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update order status"));
    } finally {
      setIsStatusSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Order Management</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review customer orders, payment details, and fulfillment statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={isLoading}
              onClick={loadOrders}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="py-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total orders</p>
              <p className="text-2xl font-semibold mt-1">{totalOrders}</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">In progress</p>
              <p className="text-2xl font-semibold mt-1">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-semibold mt-1">{deliveredCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm py-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-14 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading orders...
              </div>
            ) : null}

            {!isLoading && loadError ? (
              <div className="flex flex-col items-center text-center gap-3 py-10">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="font-medium">Could not load orders</p>
                <p className="text-sm text-muted-foreground max-w-xl">{loadError}</p>
                <Button className="cursor-pointer" onClick={loadOrders}>
                  Try again
                </Button>
              </div>
            ) : null}

            {!isLoading && !loadError && orders.length === 0 ? (
              <div className="flex flex-col items-center text-center py-14">
                <ShoppingBag className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="font-medium">No orders found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try another status filter or check back later.
                </p>
              </div>
            ) : null}

            {!isLoading && !loadError && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Placed</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const customerName = `${order?.customer?.firstName || ""} ${order?.customer?.lastName || ""}`.trim();
                      const itemCount = Array.isArray(order.items)
                        ? order.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
                        : 0;

                      return (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            <div className="space-y-0.5">
                              <p>{order.orderNumber || "-"}</p>
                              <p className="text-xs text-muted-foreground">{order._id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <p>{customerName || "-"}</p>
                              <p className="text-xs text-muted-foreground">
                                {order?.customer?.email || "-"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{itemCount}</TableCell>
                          <TableCell>
                            {formatMoney(order?.pricing?.total, order?.pricing?.currency)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="capitalize">{order?.payment?.method || "-"}</p>
                              <p className="text-xs text-muted-foreground">
                                {order?.payment?.status || "-"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeClass(order.orderStatus)}>
                              {order.orderStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleOpenDetails(order)}>
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber || "Order"} • {formatDate(selectedOrder?.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Card className="py-4 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.customer?.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.customer?.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {[
                          selectedOrder.customer?.street,
                          selectedOrder.customer?.apartment,
                          selectedOrder.customer?.city,
                          selectedOrder.customer?.county,
                          selectedOrder.customer?.postcode,
                          selectedOrder.customer?.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </p>
                    </div>
                    {selectedOrder.customer?.notes ? (
                      <div className="sm:col-span-2">
                        <p className="text-muted-foreground">Notes</p>
                        <p className="font-medium">{selectedOrder.customer.notes}</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <Card className="py-4">
                  <CardHeader>
                    <CardTitle className="text-base">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadgeClass(selectedOrder.orderStatus)}>
                        {selectedOrder.orderStatus}
                      </Badge>
                    </div>

                    <Select value={draftStatus} onValueChange={setDraftStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Update order status" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      className="w-full cursor-pointer"
                      disabled={
                        isStatusSaving ||
                        !draftStatus ||
                        draftStatus === selectedOrder.orderStatus
                      }
                      onClick={handleSaveStatus}>
                      {isStatusSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update status"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="py-4">
                <CardHeader>
                  <CardTitle className="text-base">Ordered Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Line Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(selectedOrder.items || []).map((item, idx) => (
                          <TableRow key={`${item.productId}-${item.variantId}-${idx}`}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-10 w-10 rounded-md border object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-md border bg-muted flex items-center justify-center">
                                    <UserRound className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{item.name || "-"}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {[item.color, item.size, item.ram, item.storage]
                                      .filter(Boolean)
                                      .join(" • ") || "Variant info not available"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.sku || "-"}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {formatMoney(item.unitPrice, selectedOrder?.pricing?.currency)}
                            </TableCell>
                            <TableCell>
                              {formatMoney(item.lineTotal, selectedOrder?.pricing?.currency)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Card className="py-4">
                  <CardHeader>
                    <CardTitle className="text-base">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Method</p>
                      <p className="font-medium capitalize">
                        {selectedOrder.payment?.method || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment status</p>
                      <p className="font-medium">{selectedOrder.payment?.status || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transaction ID</p>
                      <p className="font-medium">{selectedOrder.payment?.transactionId || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">
                        {formatMoney(
                          selectedOrder.payment?.amount ?? selectedOrder.pricing?.total,
                          selectedOrder?.pricing?.currency,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="py-4">
                  <CardHeader>
                    <CardTitle className="text-base">Pricing Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Items subtotal</span>
                      <span className="font-medium">
                        {formatMoney(
                          selectedOrder.pricing?.itemsSubtotal,
                          selectedOrder.pricing?.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium">
                        -{" "}
                        {formatMoney(selectedOrder.pricing?.discount, selectedOrder.pricing?.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">
                        {formatMoney(selectedOrder.pricing?.tax, selectedOrder.pricing?.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {formatMoney(
                          selectedOrder.pricing?.shippingCost,
                          selectedOrder.pricing?.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 mt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        {formatMoney(selectedOrder.pricing?.total, selectedOrder.pricing?.currency)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Orders;
