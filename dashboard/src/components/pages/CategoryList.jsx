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
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CategoryList = () => {
  
  const [finalData, setFinalData] = useState([]);
  useEffect(() => {
    async function final() {
      const data = await axios.get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory",
      );
      setFinalData(data.data.data);
    }
    final();
  }, []);

  const handleDeleteCategory = (id) => {
    axios.delete(
      `https://mern-ecommerce-91cv.onrender.com/api/v1/category/deletecategory/${id}`,
    );
    setFinalData(finalData.filter((item) => item._id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Category List</title>
      </Helmet>
      <Card className={"py-4 md:py-6 gap-3 md:gap-6"}>
        <CardHeader className={"px-3 md:px-6"}>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent className={"px-4 md:px-6"}>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finalData.map((item, index) => (
                  <TableRow key={item.name}>
                    <TableCell className={"px-6"}>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/updatecategory/${item._id}`}>
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
                                onClick={() => handleDeleteCategory(item._id)}
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
            {finalData.map((item, index) => (
              <div
                key={item._id}
                className="border rounded-xl p-4 shadow-sm space-y-4">
                {/* Serial */}
                <p className="text-sm text-muted-foreground">#{index + 1}</p>

                {/* Name */}
                <div>
                  <p className="text-base text-muted-foreground">Name</p>
                  <p className="font-medium text-base">{item.name}</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-base text-muted-foreground mb-1">Description</p>
                  <p className="text-base leading-5">{item.description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link to={`/updatecategory/${item._id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-1/2 shrink dark:bg-red-600">
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
                          onClick={() => handleDeleteCategory(item._id)}>
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

export default CategoryList;
