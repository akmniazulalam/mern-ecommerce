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
        "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory"
      );
      setFinalData(data.data.data);
    }
    final();
  }, []);

  const handleDeleteCategory = async (id) => {
    await axios.delete(
      `https://mern-ecommerce-91cv.onrender.com/api/v1/category/deletecategory/${id}`
    );
    setFinalData(finalData.filter((item) => item._id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Category List</title>
      </Helmet>

      <div className="p-4 md:p-6">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-semibold">
              📂 Category List
            </CardTitle>
          </CardHeader>

          <CardContent>

            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto">
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
                    <TableRow key={item._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/updatecategory/${item._id}`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>

                          <DeleteDialog
                            onConfirm={() =>
                              handleDeleteCategory(item._id)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* ================= MOBILE CARD VIEW ================= */}
            <div className="md:hidden space-y-4">
              {finalData.map((item, index) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-4 shadow-sm space-y-3"
                >
                  {/* Top */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-base">
                      {item.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/updatecategory/${item._id}`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        Edit
                      </Button>
                    </Link>

                    <DeleteDialog
                      onConfirm={() =>
                        handleDeleteCategory(item._id)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      </div>
    </>
  );
};

/* 🔥 Reusable Delete Dialog */
const DeleteDialog = ({ onConfirm }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" className="w-full md:w-auto">
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this category.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryList;