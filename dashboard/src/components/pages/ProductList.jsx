import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/product/getproduct",
      )
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  const handleProductDelete = async (id) => {
    try {
      await axios.delete(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/product/deleteproduct/${id}`,
      );

      setProducts(products.filter((item) => item._id !== id));

      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleCartBtn = async (item, variant) => {
    try {
      const product = {
        productId: item._id,
        name: item.name,
        price: variant.price,
        image: variant.images[0],
        color: variant.color,
        size: variant.size,
      };

      await axios.post(
        "http://localhost:3000/api/v1/cart/addtocart",
        product,
        { withCredentials: true },
      );

      toast.success("Add to cart successfully");
    } catch (error) {
      toast.error("Failed to add to cart ❌");
    }
  };

  return (
    <>
      <Helmet>
        <title>Product List</title>
      </Helmet>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>

        <CardContent className="px-4 md:px-6">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((item, productIndex) =>
                  item.variants.map((variant, variantIndex) => (
                    <TableRow
                      key={`${item._id}-${variantIndex}`}>
                      <TableCell>
                        {productIndex + 1}.{variantIndex + 1}
                      </TableCell>

                      <TableCell>
                        <div>
                          <h3 className="font-medium">
                            {item.name}
                          </h3>

                          <p className="text-xs text-muted-foreground line-clamp-2 max-w-52">
                            {item.description}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">
                              Color:
                            </span>{" "}
                            {variant.color || "N/A"}
                          </p>

                          <p>
                            <span className="font-medium">
                              Size:
                            </span>{" "}
                            {variant.size || "N/A"}
                          </p>

                          <p>
                            <span className="font-medium">
                              RAM:
                            </span>{" "}
                            {variant.ram || "N/A"}
                          </p>

                          <p>
                            <span className="font-medium">
                              Storage:
                            </span>{" "}
                            {variant.storage || "N/A"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <img
                          src={variant.images?.[0]}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-md border"
                        />
                      </TableCell>

                      <TableCell>
                        ${variant.price}
                      </TableCell>

                      <TableCell>
                        {variant.stock}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleCartBtn(item, variant)
                            }
                            className="cursor-pointer">
                            <ShoppingCart className="w-4 h-4" />
                            Cart
                          </Button>

                          <Link
                            to={`/updateproduct/${item._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="cursor-pointer">
                              Edit
                            </Button>
                          </Link>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="cursor-pointer dark:bg-red-600">
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
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() =>
                                    handleProductDelete(item._id)
                                  }
                                  className="cursor-pointer">
                                  Confirm Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {products.map((item) =>
              item.variants.map((variant, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className="border rounded-xl p-4 shadow-sm space-y-4">
                  <img
                    src={variant.images?.[0]}
                    alt={item.name}
                    className="w-full h-52 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-semibold text-base">
                      {item.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="font-medium">
                        Color:
                      </span>{" "}
                      {variant.color || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium">
                        Size:
                      </span>{" "}
                      {variant.size || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium">
                        RAM:
                      </span>{" "}
                      {variant.ram || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium">
                        Storage:
                      </span>{" "}
                      {variant.storage || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium">
                        Price:
                      </span>{" "}
                      ${variant.price}
                    </p>

                    <p>
                      <span className="font-medium">
                        Stock:
                      </span>{" "}
                      {variant.stock}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCartBtn(item, variant)
                      }
                      className="flex-1 cursor-pointer">
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                    </Button>

                    <Link
                      to={`/updateproduct/${item._id}`}
                      className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full cursor-pointer">
                        Edit
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 dark:bg-red-700 cursor-pointer">
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
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() =>
                              handleProductDelete(item._id)
                            }>
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )),
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductList;