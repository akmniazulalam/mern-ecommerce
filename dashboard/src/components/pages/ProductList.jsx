import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import { ShoppingCart, Pencil, Trash2, Package2 } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // =========================
  // GET PRODUCTS
  // =========================
  useEffect(() => {
    axios
      .get("https://mern-ecommerce-91cv.onrender.com/api/v1/product/getproduct")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleProductDelete = async (id) => {
    try {
      await axios.delete(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/product/deleteproduct/${id}`,
      );

      setProducts((prev) => prev.filter((item) => item._id !== id));

      toast.success("Product deleted");
    } catch (error) {
      toast.error("Delete failed ❌");
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const handleCartBtn = async (product, variant) => {
    try {
      const cartProduct = {
        productId: product._id,
        name: product.name,
        image: variant.images?.[0],
        color: variant.color,
        size: variant.size,
        ram: variant.ram,
        storage: variant.storage,
        price: variant.price,
      };

      await axios.post(
        "http://localhost:3000/api/v1/cart/addtocart",
        cartProduct,
        {
          withCredentials: true,
        },
      );

      toast.success("Added to cart");
    } catch (error) {
      toast.error("Cart failed ❌");
    }
  };

  return (
    <>
      <Helmet>
        <title>Product List</title>
      </Helmet>

      <div className="space-y-4">
        {/* PAGE TITLE */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Products</h2>

            <p className="text-xs text-muted-foreground mt-1">
              Manage all products & variants
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-muted px-3 py-2 rounded-lg">
            <Package2 className="w-4 h-4" />
            {products.length} {products.length > 1 ? "Products" : "Product"}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product._id} className="shadow-sm">
              <CardContent className="p-4">
                {/* PRODUCT TOP */}
                <div className="flex items-start justify-between gap-3">
                  {/* LEFT */}
                  <div className="flex gap-3">
                    {/* PRODUCT IMAGE */}
                    <img
                      src={product.variants?.[0]?.images?.[0]}
                      alt={product.name}
                      className="w-16 rounded-md object-cover border shrink-0"
                    />

                    {/* INFO */}
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">
                        {product.name}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1 max-w-md">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[11px] bg-muted px-2 py-1 rounded-md">
                          {product.category}
                        </span>

                        <span className="text-[11px] bg-muted px-2 py-1 rounded-md">
                          {product.variants.length} { product.variants.length > 1 ? "Variants" : "Variant" }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/updateproduct/${product._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs cursor-pointer">
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 text-xs cursor-pointer dark:bg-red-600">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product?</AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleProductDelete(product._id)}
                            className="cursor-pointer">
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* VARIANTS */}
                <div className="mt-4 space-y-2">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-2.5 flex items-center justify-between gap-3">
                      {/* LEFT */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* VARIANT IMAGE */}
                        <img
                          src={variant.images?.[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover border shrink-0"
                        />

                        {/* INFO */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {variant.color && (
                              <span className="bg-muted px-2 py-1 rounded">
                                {variant.color}
                              </span>
                            )}

                            {variant.size && (
                              <span className="bg-muted px-2 py-1 rounded">
                                {variant.size}
                              </span>
                            )}

                            {variant.ram && (
                              <span className="bg-muted px-2 py-1 rounded">
                                {variant.ram}
                              </span>
                            )}

                            {variant.storage && (
                              <span className="bg-muted px-2 py-1 rounded">
                                {variant.storage}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <p>
                              <span className="text-muted-foreground">
                                Price:
                              </span>{" "}
                              <span className="font-semibold">
                                ${variant.price}
                              </span>
                            </p>

                            <p>
                              <span className="text-muted-foreground">
                                Stock:
                              </span>{" "}
                              <span
                                className={`font-semibold ${
                                  variant.stock > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}>
                                {variant.stock}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CART BUTTON */}
                      <Button
                        size="sm"
                        onClick={() => handleCartBtn(product, variant)}
                        className="h-8 text-xs shrink-0 cursor-pointer">
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
