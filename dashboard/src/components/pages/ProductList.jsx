import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import VariantListPreview from "@/components/product/VariantListPreview";
import { getApiErrorMessage } from "@/lib/apiErrors";
import {
  getProductPriceRange,
  getTotalStock,
} from "@/lib/productVariants";
import {
  deleteProduct,
  fetchProducts,
} from "@/services/productService";
import {
  AlertCircle,
  Loader2,
  Package2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadProductsData = async (isMounted) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchProducts();
      if (isMounted) {
        setProducts(data);
      }
    } catch (error) {
      if (isMounted) {
        setLoadError(getApiErrorMessage(error, "Failed to load products"));
        setProducts([]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadProductsData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleProductDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete product"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Product List</title>
      </Helmet>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Products</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage catalog items and their variants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadProductsData(true)}
              disabled={isLoading}
              className="cursor-pointer">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild size="sm" className="cursor-pointer">
              <Link to="/products">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        ) : null}

        {!isLoading && loadError ? (
          <div className="border border-destructive/30 rounded-2xl p-6 text-center space-y-3 bg-destructive/5">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-sm font-medium">{loadError}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => loadProductsData(true)}>
              Try Again
            </Button>
          </div>
        ) : null}

        {!isLoading && !loadError && products.length === 0 ? (
          <div className="border rounded-2xl p-12 text-center space-y-3">
            <Package2 className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="font-medium text-base">No products found</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Start by creating your first product with color, size, or image variants.
            </p>
            <Button asChild size="sm" className="mt-2 cursor-pointer">
              <Link to="/products">
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </Link>
            </Button>
          </div>
        ) : null}

        {!isLoading && !loadError && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((product) => {
              const { minPrice, maxPrice } = getProductPriceRange(product.variants);
              const totalStock = getTotalStock(product.variants);

              return (
                <Card key={product._id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {product.category || "Uncategorized"}
                        </Badge>
                      </div>

                      <Badge
                        variant={totalStock > 0 ? "secondary" : "destructive"}
                        className="shrink-0">
                        {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                      {product.description || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between text-sm pt-1 border-t">
                      <span className="text-muted-foreground text-xs font-medium">Price</span>
                      <span className="font-semibold">
                        {minPrice === maxPrice
                          ? `$${minPrice.toFixed(2)}`
                          : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
                      </span>
                    </div>

                    <VariantListPreview variants={product.variants} />

                    <div className="flex items-center justify-end gap-2 pt-2 border-t">
                      <Button asChild size="sm" variant="outline" className="cursor-pointer">
                        <Link to={`/updateproduct/${product._id}`}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === product._id}
                            className="cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleProductDelete(product._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ProductList;
