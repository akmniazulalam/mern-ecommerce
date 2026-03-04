import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const Products = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");

  const handleCreateProduct = () => {
    console.log("jkkk");
  };
  const [getCategory, setGetCategory] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory",
      )
      .then((res) => setGetCategory(res.data.data));
  }, []);

  console.log(getCategory);
  
  return (
    <>
      <h3 className="font-bold">Add Product</h3>
      <div className="max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Product Name</FieldLabel>
            <Input
              value={productName}
              placeholder="Product Name"
              onChange={(e) => setProductName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Product Description</FieldLabel>
            <Textarea
              value={productDescription}
              placeholder="Type your description here..."
              className={"resize-none"}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <select className="border border-gray-200 rounded-sm p-2">
              {getCategory.map((item) => (
                <option>{item.name}</option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel>Price</FieldLabel>
            <Input
              value={price}
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Size</FieldLabel>
            <Input
              value={size}
              placeholder="Size"
              onChange={(e) => setSize(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Color</FieldLabel>
            <Input
              value={color}
              placeholder="Color"
              onChange={(e) => setColor(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Ram</FieldLabel>
            <Input
              value={ram}
              placeholder="Ram"
              onChange={(e) => setRam(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Storage</FieldLabel>
            <Input
              value={storage}
              placeholder="Storage"
              onChange={(e) => setStorage(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Product Image</FieldLabel>
            <Input
            type={"file"}
              placeholder="Product Image"
              // onChange={(e) => setStorage(e.target.value)}
            />
          </Field>

          <Field orientation="horizontal">
            <Button onClick={handleCreateProduct}>Add Product</Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default Products;
