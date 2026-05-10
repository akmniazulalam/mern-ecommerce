import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";
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

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [getCategory, setGetCategory] = useState([]);

  const [variants, setVariants] = useState([]);

  // =========================
  // LOAD PRODUCT
  // =========================
  useEffect(() => {
    axios
      .get(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/product/singleproduct/${id}`,
      )
      .then((res) => {
        const data = res.data.data;

        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
        setVariants(data.variants || []);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory",
      )
      .then((res) => setGetCategory(res.data.data));
  }, []);

  // =========================
  // HANDLE VARIANT CHANGE
  // =========================
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (index, file) => {
    const updated = [...variants];
    updated[index].image = file;
    setVariants(updated);
  };

  // =========================
  // SUBMIT UPDATE
  // =========================
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append(
        "variants",
        JSON.stringify(
          variants.map((v, i) => ({
            ...v,
            index: i,
          })),
        ),
      );

      variants.forEach((v) => {
        if (v.image) {
          formData.append("images", v.image);
        }
      });

      await axios.patch(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/product/updateproduct/${id}`,
        formData,
      );

      toast.success("Product updated");
      navigate("/productlist");
    } catch (error) {
      toast.error("Update failed ❌");
    }
  };
  return (
    <>
      <Helmet>
        <title>Update Product</title>
      </Helmet>

      <div className="max-w-xl space-y-4">
        <h2 className="font-bold text-2xl">Update Product</h2>

        <FieldGroup>
          <Field>
            <FieldLabel className="font-semibold text-sm md:text-base">
              Name
            </FieldLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field>
            <FieldLabel className="font-semibold text-sm md:text-base">
              Description
            </FieldLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel className="font-semibold text-sm md:text-base">
              Category
            </FieldLabel>
            <Select
              onValueChange={(value) => {
                setCategory(value);
              }}>
              <SelectTrigger className="w-40 h-10 cursor-pointer text-white!">
                <SelectValue placeholder={category} />
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
        </FieldGroup>

        {/* ========================= */}
        {/* VARIANTS */}
        {/* ========================= */}
        <div className="space-y-4">
          <h3 className="font-semibold">Variants</h3>

          {variants.map((v, index) => (
            <div key={index} className="border p-3 rounded space-y-2">
              <Input
                placeholder="Color"
                value={v.color || ""}
                onChange={(e) =>
                  handleVariantChange(index, "color", e.target.value)
                }
              />

              <Input
                placeholder="Size"
                value={v.size || ""}
                onChange={(e) =>
                  handleVariantChange(index, "size", e.target.value)
                }
              />

              <Input
                placeholder="Ram"
                value={v.ram || ""}
                onChange={(e) =>
                  handleVariantChange(index, "ram", e.target.value)
                }
              />

              <Input
                placeholder="Storage"
                value={v.storage || ""}
                onChange={(e) =>
                  handleVariantChange(index, "storage", e.target.value)
                }
              />

              <Input
                placeholder="Price"
                value={v.price || ""}
                onChange={(e) =>
                  handleVariantChange(index, "price", e.target.value)
                }
              />

              <Input
                type="file"
                onChange={(e) => {
                  handleImageChange(index, e.target.files[0]);
                }}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleUpdate} className="w-full cursor-pointer">
          Update Product
        </Button>
      </div>
    </>
  );
};

export default UpdateProduct;
