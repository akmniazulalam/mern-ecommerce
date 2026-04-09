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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://mern-ecommerce-91cv.onrender.com/api/v1/product/getproduct")
      .then((res) => setProducts(res.data.data));
  }, []);

  const handleProductDelete = (id) => {
    axios.delete(
      `https://mern-ecommerce-91cv.onrender.com/api/v1/product/deleteproduct/${id}`,
    );
    setProducts(products.filter((item) => item._id !== id));
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
        <CardContent className={"px-4 md:px-6"}>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Ram</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell className={"px-6"}>{index + 1}</TableCell>
                    <TableCell className="max-w-40 truncate">
                      {item.name}
                    </TableCell>
                    <TableCell className="max-w-50 truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.ram}</TableCell>
                    <TableCell>{item.storage}</TableCell>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={"h-14 rounded-sm"}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/updateproduct/${item._id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className={"cursor-pointer"}>
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
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() => handleProductDelete(item._id)}
                                className={"cursor-pointer"}>
                                Confirm Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4">
            {products.map((item, index) => (
              <div
                key={item._id}
                className="border rounded-xl p-4 shadow-sm space-y-3">
                {/* Top section */}
                <div className="">
                  <img
                    src={item.image}
                    alt={item.name}
                    className=" rounded-md"
                  />

                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      #{index + 1}
                    </p>

                    <h3 className="font-semibold leading-tight text-sm my-1.5">{item.name}</h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Price:</span> $
                    {item.price}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Category:</span>{" "}
                    {item.category}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Size:</span>{" "}
                    {item.size}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Color:</span>{" "}
                    {item.color}
                  </p>
                  <p>
                    <span className="text-muted-foreground">RAM:</span>{" "}
                    {item.ram}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Storage:</span>{" "}
                    {item.storage}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link to={`/updateproduct/${item._id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-1/2 md:w-full md:shrink dark:bg-red-700">
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => handleProductDelete(item._id)}>
                          Confirm Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductList;
