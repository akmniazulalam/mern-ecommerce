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
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CategoryList = () => {
  const categories = [
    { id: 1, name: "Electronics", description: "Phones, Laptops, etc." },
    { id: 2, name: "Fashion", description: "Clothes, Shoes, Bags" },
    { id: 3, name: "Home & Kitchen", description: "Furniture & Appliances" },
    { id: 4, name: "Sports", description: "Sports items" },
    { id: 5, name: "Books", description: "Books & Stationery" },
  ];
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
      <Card>
      <CardHeader>
        <CardTitle>Category List</CardTitle>
      </CardHeader>
      <CardContent>
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
                            This action cannot be undone. This will permanently
                            delete this category.
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
      </CardContent>
    </Card>
    </>
  );
};

export default CategoryList;
