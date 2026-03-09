import React, { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Pencil, Trash } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/product/getproduct",
      );

      setProducts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>
      </div>

      {/* PRODUCT GRID */}

      <div className="grid grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id}>
            <CardHeader>
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md"
              />
            </CardHeader>

            <CardContent className="space-y-2 px-5">
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
                <Button variant="outline" size="sm" className={"cursor-pointer"}>
                  <Pencil size={16} />
                  Edit
                </Button>

                <Button variant="destructive" size="sm" className={"cursor-pointer"}>
                  <Trash size={16} />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
