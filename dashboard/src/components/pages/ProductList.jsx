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
      {/* <div className="mb-6">
        <h3 className="text-2xl font-bold">Product List</h3>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {products.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md"
              />
            </CardHeader>

            <CardContent className="space-y-2 px-4">
              <CardTitle className="text-lg">{product.name}</CardTitle>

              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>

              <Badge>{product.category}</Badge>

              <p className="font-semibold">${product.price}</p>

              <div className="text-sm flex gap-3">
                <span>RAM: {product.ram}</span>

                <span>Storage: {product.storage}</span>
              </div>

              <p className="text-sm">Color: {product.color}</p>

              <p className="text-sm">Size: {product.size}</p>

              <div className="flex gap-3 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className={"cursor-pointer"}>
                  <Pencil size={16} />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className={"cursor-pointer"}
                  onClick={() => handleProductDelete(product._id)}>
                  <Trash size={16} />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableRow key={item.name}>
                  <TableCell className={"px-6"}>{index + 1}</TableCell>
                  <TableCell className="max-w-40 truncate">{item.name}</TableCell>
                  <TableCell className="max-w-50 truncate">{item.description}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>{item.ram}</TableCell>
                  <TableCell>{item.storage}</TableCell>
                  <TableCell>
                    <img src={item.image} alt={item.name} className={"h-14 rounded-sm"}/>
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
        </CardContent>
      </Card>
    </>
  );
};

export default ProductList;
