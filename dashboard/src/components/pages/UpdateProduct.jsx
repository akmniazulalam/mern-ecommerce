import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateProduct = () => {
  const { id } = useParams();
  const [updateName, setUpdateName] = useState("");
  const [updateDes, setUpdateDes] = useState("");
  const [updateCategory, setUpdateCategory] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateSize, setUpdateSize] = useState("");
  const [updateColor, setUpdateColor] = useState("");
  const [updateRam, setUpdateRam] = useState("");
  const [updateStorage, setUpdateStorage] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/product/singleproduct/${id}`,
      )
      .then((res) => {
        setUpdateName(res.data.data.name);
        setUpdateDes(res.data.data.description);
        setUpdateCategory(res.data.data.category);
        setUpdatePrice(res.data.data.price);
        setUpdateSize(res.data.data.size);
        setUpdateColor(res.data.data.color);
        setUpdateRam(res.data.data.ram);
        setUpdateStorage(res.data.data.storage);
        setPrevImage(res.data.data.image);
      });
  }, []);

  const [getCategory, setGetCategory] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory",
      )
      .then((res) => setGetCategory(res.data.data));
  }, []);

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
    formData.append("name", updateName);
    formData.append("description", updateDes);
    formData.append("category", updateCategory);
    formData.append("price", updatePrice);
    formData.append("size", updateSize);
    formData.append("color", updateColor);
    formData.append("ram", updateRam);
    formData.append("storage", updateStorage);
    if (updateImage) {
      formData.append("image", updateImage);
    }
    await axios.patch(
      `https://mern-ecommerce-91cv.onrender.com/api/v1/product/updateproduct/${id}`,
      formData,
    );
    toast.success("Successfully Updated");
    setUpdateName("");
    setUpdateDes("");
    setUpdateCategory("");
    setUpdatePrice("");
    setUpdateSize("");
    setUpdateColor("");
    setUpdateRam("");
    setUpdateStorage("");
    setPrevImage("");
    setUpdateImage("");
    setTimeout(() => {
      navigate("/productlist");
    }, 1000);
    }
    catch(error){
      toast.error("update failed")
    }
  };
  return (
    <>
      <h3 className="font-bold">Update Product</h3>
      <div className="max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Update Product Name</FieldLabel>
            <Input
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Update Product Description</FieldLabel>
            <Textarea
              value={updateDes}
              className={"resize-none"}
              onChange={(e) => setUpdateDes(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Update Product Category</FieldLabel>
            <select
              value={updateCategory}
              className="border border-gray-200 rounded-sm p-2"
              onChange={(e) => setUpdateCategory(e.target.value)}>
              {getCategory.map((item) => (
                <option className={"dark:bg-blue-900"}>{item.name}</option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel>Update Product Price</FieldLabel>
            <Input
              value={updatePrice}
              onChange={(e) => setUpdatePrice(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Update Product Size</FieldLabel>
            <Input
              value={updateSize}
              onChange={(e) => setUpdateSize(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Update Product Color</FieldLabel>
            <Input
              value={updateColor}
              onChange={(e) => setUpdateColor(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Update Product Ram</FieldLabel>
            <Input
              value={updateRam}
              onChange={(e) => setUpdateRam(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Update Product Storage</FieldLabel>
            <Input
              value={updateStorage}
              onChange={(e) => setUpdateStorage(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Update Product Image</FieldLabel>
            {prevImage && (
              <img src={prevImage} alt="product" className="mb-3 rounded" />
            )}
            <input
              type={"file"}
              onChange={(e) => setUpdateImage(e.target.files[0])}
            />
          </Field>
          <Field orientation="horizontal">
            <Button onClick={handleUpdateProduct} className={"cursor-pointer"}>
              Update Product
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default UpdateProduct;
