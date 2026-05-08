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

import { ShoppingCart, Pencil, Trash2 } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // =========================
  // GET PRODUCTS
  // =========================
  useEffect(() => {
    axios
      .get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/product/getproduct",
      )
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

      setProducts((prev) =>
        prev.filter((item) => item._id !== id),
      );

      toast.success("Product deleted successfully");
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

      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error("Failed to add cart ❌");
    }
  };

  return (
    <>
      <Helmet>
        <title>Product List</title>
      </Helmet>

      <div className="space-y-6">
        {/* PAGE TITLE */}
        <div>
          <h2 className="text-2xl font-bold">
            Product List
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Manage all your products and variants
          </p>
        </div>

        {/* PRODUCTS */}
        {products.map((product) => (
          <Card
            key={product._id}
            className="overflow-hidden border shadow-sm">
            <CardContent className="p-0">
              {/* TOP PRODUCT INFO */}
              <div className="border-b p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* LEFT */}
                  <div className="flex gap-4">
                    {/* MAIN IMAGE */}
                    <img
                      src={
                        product.variants?.[0]?.images?.[0]
                      }
                      alt={product.name}
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border"
                    />

                    {/* PRODUCT INFO */}
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-2xl">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">
                          {product.category}
                        </span>

                        <span className="text-xs bg-muted px-3 py-1 rounded-full">
                          {
                            product.variants.length
                          }{" "}
                          Variants
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2">
                    <Link
                      to={`/updateproduct/${product._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer">
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone.
                            This will permanently delete
                            the product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() =>
                              handleProductDelete(
                                product._id,
                              )
                            }>
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>

              {/* VARIANTS */}
              <div className="p-5">
                <h4 className="font-semibold mb-4 text-sm md:text-base">
                  Product Variants
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {product.variants.map(
                    (variant, index) => (
                      <div
                        key={index}
                        className="border rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                        {/* VARIANT IMAGE */}
                        <img
                          src={
                            variant.images?.[0]
                          }
                          alt={product.name}
                          className="w-full h-52 object-cover rounded-xl border"
                        />

                        {/* VARIANT INFO */}
                        <div className="mt-4 space-y-2">
                          {/* TOP */}
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold">
                              Variant{" "}
                              {index + 1}
                            </h5>

                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                variant.stock > 0
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              }`}>
                              {variant.stock > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          </div>

                          {/* ATTRIBUTES */}
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                Color:
                              </span>{" "}
                              {variant.color ||
                                "N/A"}
                            </p>

                            <p>
                              <span className="text-muted-foreground">
                                Size:
                              </span>{" "}
                              {variant.size ||
                                "N/A"}
                            </p>

                            <p>
                              <span className="text-muted-foreground">
                                RAM:
                              </span>{" "}
                              {variant.ram ||
                                "N/A"}
                            </p>

                            <p>
                              <span className="text-muted-foreground">
                                Storage:
                              </span>{" "}
                              {variant.storage ||
                                "N/A"}
                            </p>
                          </div>

                          {/* PRICE + STOCK */}
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Price
                              </p>

                              <h4 className="text-lg font-bold">
                                $
                                {
                                  variant.price
                                }
                              </h4>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Stock
                              </p>

                              <h4 className="font-semibold">
                                {
                                  variant.stock
                                }
                              </h4>
                            </div>
                          </div>

                          {/* BUTTON */}
                          <Button
                            onClick={() =>
                              handleCartBtn(
                                product,
                                variant,
                              )
                            }
                            className="w-full mt-3 cursor-pointer">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add To Cart
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ProductList;