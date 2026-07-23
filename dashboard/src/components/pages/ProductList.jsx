import React, { useCallback, useEffect, useState } from "react";
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

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Failed to load products"));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
              className="h-8 cursor-pointer"
              disabled={isLoading}
              onClick={loadProducts}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 h-8">
              <Package2 className="h-3.5 w-3.5" />
              {products.length} {products.length === 1 ? "product" : "products"}
            </Badge>
            <Button asChild className="cursor-pointer h-8">
              <Link to="/products">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add product
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading products...
          </div>
        ) : null}

        {!isLoading && loadError ? (
          <Card className="py-10">
            <CardContent className="flex flex-col items-center text-center gap-3">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="font-medium">Could not load products</p>
              <p className="text-sm text-muted-foreground max-w-md">{loadError}</p>
              <Button className="cursor-pointer" onClick={loadProducts}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !loadError && products.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Package2 className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">No products yet</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Add your first product with variants to get started.
              </p>
              <Button asChild className="cursor-pointer">
                <Link to="/products">Add product</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !loadError && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => {
              const variants = product.variants ?? [];
              const variantCount = variants.length;
              const priceLabel = getProductPriceRange(variants);
              const totalStock = getTotalStock(variants);
              const isDeleting = deletingId === product._id;

              return (
                <Card
                  key={product._id}
                  className={`shadow-sm py-0 gap-0 overflow-hidden transition-opacity ${isDeleting ? "opacity-60" : ""}`}>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex gap-3 min-w-0">
                        <img
                          src={variants[0]?.images?.[0]}
                          alt={product.name}
                          className="h-16 w-16 shrink-0 rounded-lg border object-cover bg-muted"
                        />

                        <div className="min-w-0 space-y-2">
                          <div>
                            <h3 className="font-semibold text-base leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 max-w-xl">
                              {product.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {product.category ? (
                              <Badge variant="outline" className="text-[11px]">
                                {product.category}
                              </Badge>
                            ) : null}
                            <Badge variant="secondary" className="text-[11px]">
                              {variantCount}{" "}
                              {variantCount === 1 ? "variant" : "variants"}
                            </Badge>
                            {priceLabel ? (
                              <Badge variant="outline" className="text-[11px] font-semibold">
                                {priceLabel}
                              </Badge>
                            ) : null}
                            <span className="text-[11px] text-muted-foreground">
                              Total stock:{" "}
                              <span
                                className={
                                  totalStock > 0
                                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                                    : "font-medium text-destructive"
                                }>
                                {totalStock}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0 sm:self-start">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          disabled={isDeleting}
                          className="h-8 text-xs cursor-pointer">
                          <Link to={`/updateproduct/${product._id}`}>
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isDeleting}
                              className="h-8 text-xs cursor-pointer dark:bg-red-600">
                              {isDeleting ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3 mr-1" />
                              )}
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete product?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove &quot;{product.name}&quot; and all{" "}
                                {variantCount} variant{variantCount === 1 ? "" : "s"}.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="cursor-pointer"
                                onClick={() => handleProductDelete(product._id)}>
                                Confirm delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <VariantListPreview product={product} />
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
