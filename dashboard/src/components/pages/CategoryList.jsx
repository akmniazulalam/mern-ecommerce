import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

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
  return (
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
                <TableCell className={"px-6"}>{index+1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link to={`/updatecategory/${item._id}`}>
                      <Button size="sm" variant="outline" className={"cursor-pointer"}>
                        Edit
                      </Button>
                    </Link>
                    <Link to={"/"}>
                      <Button size="sm" variant="destructive" className={"cursor-pointer"}>
                        Delete
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
