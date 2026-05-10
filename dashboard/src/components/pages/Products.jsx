import axios from "axios";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet-async";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      ram: "",
      storage: "",
      stock: "",
      price: "",
      image: null,
    },
  ]);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleRemoveVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        size: "",
        ram: "",
        storage: "",
        stock: "",
        price: "",
        image: null,
      },
    ]);
  };

  const handleCreateProduct = async () => {
    const formData = new FormData();

    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("category", selectedCategory);

    const variantData = variants.map((v) => ({
      color: v.color,
      size: v.size,
      ram: v.ram,
      storage: v.storage,
      stock: v.stock,
      price: v.price,
    }));

    formData.append("variants", JSON.stringify(variantData));

    variants.forEach((v) => {
      formData.append("images", v.image);
    });

    try {
      await axios.post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/product/createproduct",
        formData,
      );

      toast.success("Successfully added!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const [getCategory, setGetCategory] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory",
      )
      .then((res) => {
        setGetCategory(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedCategory(res.data.data[0].name);
        }
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Add Product</title>
      </Helmet>
      <h3 className="font-bold md:text-2xl">Add Product</h3>
      <div className="md:max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel className={"md:text-base font-semibold"}>Product Name</FieldLabel>
            <Input
              value={productName}
              placeholder="Product Name"
              className={"text-sm"}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel className={"md:text-base font-semibold"}>Product Description</FieldLabel>
            <Textarea
              value={productDescription}
              placeholder="Type your description here..."
              className={"resize-none text-sm"}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel className={"md:text-base font-semibold"}>Category</FieldLabel>
            <Select
              onValueChange={(value) => {
                setSelectedCategory(value);
              }}>
              <SelectTrigger className="w-40 h-10 cursor-pointer">
                <SelectValue placeholder={"Select Category"} />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {getCategory.map((item) => (
                    <SelectItem
                      key={item._id}
                      value={item.name}
                      className={"cursor-pointer"}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <div>
            <h4 className="font-semibold mb-2">Variants</h4>

            {variants.map((variant, index) => (
              <div
                key={index}
                className="border p-4 mb-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Color</FieldLabel>

                  <Input
                    placeholder="Color"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(index, "color", e.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Size</FieldLabel>

                  <Input
                    placeholder="Size"
                    value={variant.size}
                    onChange={(e) =>
                      handleVariantChange(index, "size", e.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>RAM</FieldLabel>

                  <Input
                    placeholder="RAM"
                    value={variant.ram}
                    onChange={(e) =>
                      handleVariantChange(index, "ram", e.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Storage</FieldLabel>

                  <Input
                    placeholder="Storage"
                    value={variant.storage}
                    onChange={(e) =>
                      handleVariantChange(index, "storage", e.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Stock</FieldLabel>

                  <Input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    min={1}
                    className={"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
                    onChange={(e) =>
                    {
                      if(e.target.value >= 0) {
                        handleVariantChange(index, "stock", e.target.value)
                      }
                    }
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Price</FieldLabel>

                  <Input
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Variant Image</FieldLabel>

                  <Input
                    type="file"
                    onChange={(e) =>
                      handleVariantChange(index, "image", e.target.files[0])
                    }
                  />
                </Field>
                </div>

                <div className="text-end mt-3">
                  <Button
                  variant="destructive"
                  className={"cursor-pointer dark:bg-red-600"}
                  onClick={() => handleRemoveVariant(index)}>
                  Remove
                </Button>
                </div>
              </div>
            ))}

            <Button onClick={handleAddVariant} className={"cursor-pointer"}>
              + Add Variant
            </Button>
          </div>

          <Field orientation="horizontal">
            <Button onClick={handleCreateProduct} className={"cursor-pointer"}>
              Add Product
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default Products;
