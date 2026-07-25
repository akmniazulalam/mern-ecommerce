import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clock,
  FolderPlus,
  Layers,
  Loader2,
  Package,
  PackageCheck,
  PackagePlus,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Ticket,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";
import { authPaths, categoryPaths, couponPaths, unwrapApiData } from "@/lib/productApi";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { fetchProducts } from "@/services/productService";
import { fetchAdminOrders, ORDER_STATUSES } from "@/services/orderService";

const LOW_STOCK_THRESHOLD = 5;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatMoney(amount, currency = "USD") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "-";

  if (currency === "USD") {
    return currencyFormatter.format(value);
  }

  return `${value.toFixed(2)} ${currency}`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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

function getOrderItemCount(order) {
  return Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    : 0;
}

function getProductStocks(product) {
  return Array.isArray(product?.variants)
    ? product.variants.map((variant) => Number(variant.stock) || 0)
    : [];
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="py-5">
            <CardContent className="space-y-3">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-8 w-20 rounded bg-muted animate-pulse" />
              <div className="h-3 w-32 rounded bg-muted animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="py-5 lg:col-span-2">
          <CardContent className="space-y-4">
            <div className="h-5 w-32 rounded bg-muted animate-pulse" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 rounded bg-muted animate-pulse" />
            ))}
          </CardContent>
        </Card>
        <Card className="py-5">
          <CardContent className="space-y-4">
            <div className="h-5 w-32 rounded bg-muted animate-pulse" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-9 rounded bg-muted animate-pulse" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, description }) {
  return (
    <Card className="group py-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {React.createElement(icon, { className: "h-5 w-5" })}
        </div>
      </CardContent>
    </Card>
  );
}

function CompactMetric({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        {React.createElement(icon, {
          className: "h-4 w-4 shrink-0 text-muted-foreground",
        })}
        <span className="truncate text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="shrink-0 text-sm font-semibold">{value}</span>
    </div>
  );
}

function EmptyState({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {React.createElement(icon, { className: "h-9 w-9 text-muted-foreground" })}
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [productList, orderList, userResponse, categoryResponse, couponResponse] =
        await Promise.all([
          fetchProducts(),
          fetchAdminOrders(),
          apiClient.get(authPaths.userList),
          apiClient.get(categoryPaths.list),
          apiClient.get(couponPaths.list),
        ]);

      setProducts(Array.isArray(productList) ? productList : []);
      setOrders(Array.isArray(orderList) ? orderList : []);
      setUsers(Array.isArray(unwrapApiData(userResponse)) ? unwrapApiData(userResponse) : []);
      setCategories(
        Array.isArray(unwrapApiData(categoryResponse)) ? unwrapApiData(categoryResponse) : [],
      );
      setCoupons(Array.isArray(unwrapApiData(couponResponse)) ? unwrapApiData(couponResponse) : []);
      setLastUpdated(new Date());
    } catch (error) {
      setProducts([]);
      setOrders([]);
      setUsers([]);
      setCategories([]);
      setCoupons([]);
      setLoadError(getApiErrorMessage(error, "Failed to load dashboard data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  const inventory = useMemo(() => {
    const inStock = products.filter((product) =>
      getProductStocks(product).some((stock) => stock > 0),
    ).length;
    const lowStock = products.filter((product) =>
      getProductStocks(product).some(
        (stock) => stock > 0 && stock <= LOW_STOCK_THRESHOLD,
      ),
    ).length;
    const outOfStock = products.filter((product) => {
      const stocks = getProductStocks(product);
      return stocks.length === 0 || stocks.every((stock) => stock <= 0);
    }).length;

    return { inStock, lowStock, outOfStock };
  }, [products]);

  const orderStatusCounts = useMemo(() => {
    return ORDER_STATUSES.reduce((acc, status) => {
      acc[status] = orders.filter((order) => order.orderStatus === status).length;
      return acc;
    }, {});
  }, [orders]);

  const revenue = useMemo(() => {
    const revenueOrders = orders.filter(
      (order) =>
        order.orderStatus !== "Cancelled" &&
        Number.isFinite(Number(order?.pricing?.total)),
    );

    return revenueOrders.reduce(
      (sum, order) => sum + Number(order?.pricing?.total || 0),
      0,
    );
  }, [orders]);

  const canShowRevenue = orders.some((order) =>
    Number.isFinite(Number(order?.pricing?.total)),
  );
  const recentOrders = orders.slice(0, 5);
  const activeCoupons = coupons.filter((coupon) => coupon.isActive).length;
  const pendingOrders = orderStatusCounts.Pending || 0;
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin";

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              <CalendarDays className="mr-2 inline h-4 w-4" />
              {today}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back, {displayName} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's what's happening in your store today.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer md:w-auto"
            disabled={isLoading}
            onClick={loadDashboardData}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? <DashboardSkeleton /> : null}

        {!isLoading && loadError ? (
          <Card className="py-8">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-9 w-9 text-destructive" />
                <p className="mt-3 font-medium">Could not load dashboard data</p>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  {loadError}
                </p>
                <Button className="mt-4 cursor-pointer" onClick={loadDashboardData}>
                  Try again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !loadError ? (
          <>
            <Card className="py-5">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-lg">Store Health</CardTitle>
                  <Badge variant="outline" className="w-fit border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Data connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <CompactMetric label="Total Products" value={products.length} icon={Package} />
                  <CompactMetric label="Pending Orders" value={pendingOrders} icon={Clock} />
                  <CompactMetric
                    label="Low Stock Products"
                    value={inventory.lowStock}
                    icon={AlertCircle}
                  />
                  <CompactMetric
                    label="Last Updated"
                    value={formatDateTime(lastUpdated)}
                    icon={RefreshCw}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total Products"
                value={products.length}
                icon={Package}
                description={`${inventory.inStock} products currently in stock`}
              />
              <MetricCard
                title="Total Orders"
                value={orders.length}
                icon={ShoppingBag}
                description={`${pendingOrders} pending fulfillment`}
              />
              <MetricCard
                title="Total Users"
                value={users.length}
                icon={UsersRound}
                description="Registered customer accounts"
              />
              <MetricCard
                title={canShowRevenue ? "Total Revenue" : "Total Sales Count"}
                value={canShowRevenue ? formatMoney(revenue) : orders.length}
                icon={canShowRevenue ? WalletCards : ReceiptText}
                description={
                  canShowRevenue
                    ? "Calculated from available order totals"
                    : "Revenue totals are not available"
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
              <Card className="py-5 xl:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Order Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <EmptyState
                      title="No orders yet"
                      description="Order status metrics will appear after customers complete checkout."
                      icon={ShoppingBag}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5">
                      {ORDER_STATUSES.map((status) => (
                        <div
                          key={status}
                          className="rounded-lg border bg-muted/10 p-3 transition-colors hover:bg-muted/20">
                          <Badge className={getStatusBadgeClass(status)}>{status}</Badge>
                          <p className="mt-3 text-2xl font-bold">
                            {orderStatusCounts[status] || 0}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {status === "Pending" ? "Awaiting action" : "Orders"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="py-5 xl:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Inventory Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CompactMetric
                    label="Products In Stock"
                    value={inventory.inStock}
                    icon={PackageCheck}
                  />
                  <CompactMetric
                    label="Low Stock Products"
                    value={inventory.lowStock}
                    icon={AlertCircle}
                  />
                  <CompactMetric
                    label="Out of Stock Products"
                    value={inventory.outOfStock}
                    icon={Boxes}
                  />
                  <CompactMetric
                    label="Total Categories"
                    value={categories.length}
                    icon={Layers}
                  />
                  <CompactMetric label="Active Coupons" value={activeCoupons} icon={Ticket} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <Card className="py-5 xl:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/orders">
                        View all <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <EmptyState
                      title="No recent orders"
                      description="Latest customer orders will appear here automatically."
                      icon={ReceiptText}
                    />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead scope="col">Order Number</TableHead>
                          <TableHead scope="col">Customer</TableHead>
                          <TableHead scope="col">Amount</TableHead>
                          <TableHead scope="col">Status</TableHead>
                          <TableHead scope="col">Date</TableHead>
                          <TableHead scope="col" className="text-right">View</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => {
                          const customerName = `${order?.customer?.firstName || ""} ${order?.customer?.lastName || ""}`.trim();

                          return (
                            <TableRow key={order._id}>
                              <TableCell className="font-medium">
                                <div className="space-y-0.5">
                                  <p>{order.orderNumber || "-"}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {getOrderItemCount(order)} items
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-0.5">
                                  <p>{customerName || "-"}</p>
                                  <p className="max-w-44 truncate text-xs text-muted-foreground">
                                    {order?.customer?.email || "-"}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatMoney(order?.pricing?.total, order?.pricing?.currency)}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadgeClass(order.orderStatus)}>
                                  {order.orderStatus || "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(order.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <Button asChild size="sm" variant="outline">
                                  <Link to="/orders">View</Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card className="py-5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <Button asChild variant="outline" className="h-11 justify-start">
                    <Link to="/products">
                      <PackagePlus className="h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 justify-start">
                    <Link to="/category">
                      <FolderPlus className="h-4 w-4" />
                      Create Category
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 justify-start">
                    <Link to="/coupon">
                      <Ticket className="h-4 w-4" />
                      Create Coupon
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 justify-start">
                    <Link to="/orders">
                      <ShoppingBag className="h-4 w-4" />
                      Manage Orders
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
