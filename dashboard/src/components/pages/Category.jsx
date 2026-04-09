import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const navigate = useNavigate();
  const formData = {
    name: categoryName,
    description: categoryDescription,
  };
  const handleCreateCategory = () => {
    axios.post(
      "https://mern-ecommerce-91cv.onrender.com/api/v1/category/createcategory",
      formData,
    );
    toast.success("Successfully added!");
    setCategoryName("");
    setCategoryDescription("");
    setTimeout(() => {
      navigate("/categorylist");
    }, 1000);
  };
  return (
    <>
      <Helmet>
        <title>Add Category</title>
      </Helmet>
      <h3 className="font-bold">Add Category</h3>
      <div className="md:max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Category Name</FieldLabel>
            <Input
              value={categoryName}
              placeholder="Category Name"
              className={""}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Category Description</FieldLabel>
            <Textarea
              value={categoryDescription}
              placeholder="Type your description here..."
              className={"resize-none"}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </Field>
          <Field orientation="horizontal">
            <Button onClick={handleCreateCategory} className={"cursor-pointer"}>
              Add Category
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default Category;
