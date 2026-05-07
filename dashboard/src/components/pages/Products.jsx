import axios from "axios";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet-async";

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

    // images (order maintain করবে)
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
      toast.error("Product creation failed");
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
      <h3 className="font-bold">Add Product</h3>
      <div className="md:max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Product Name</FieldLabel>
            <Input
              value={productName}
              placeholder="Product Name"
              className={"text-sm"}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Product Description</FieldLabel>
            <Textarea
              value={productDescription}
              placeholder="Type your description here..."
              className={"resize-none text-sm"}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <select
              className="border border-gray-200 rounded-sm p-2"
              onChange={(e) => setSelectedCategory(e.target.value)}>
              {getCategory.map((item) => (
                <option
                  className={"dark:bg-blue-900"}
                  key={item._id}
                  value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Variants</h4>

            {variants.map((variant, index) => (
              <div
                key={index}
                className="border p-4 mb-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    onChange={(e) =>
                      handleVariantChange(index, "stock", e.target.value)
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

                <Button
                  variant="destructive"
                  onClick={() => handleRemoveVariant(index)}>
                  Remove
                </Button>
              </div>
            ))}

            <Button onClick={handleAddVariant}>+ Add Variant</Button>
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
