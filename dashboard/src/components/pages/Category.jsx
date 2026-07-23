import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/apiClient";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { categoryPaths } from "@/lib/productApi";

const Category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const formData = {
    name: categoryName,
    description: categoryDescription,
  };
  const handleCreateCategory = async () => {
    const nextErrors = {};

    if (!categoryName.trim()) {
      nextErrors.name = "Category name is required";
    }

    if (!categoryDescription.trim()) {
      nextErrors.description = "Category description is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await apiClient.post(categoryPaths.create, formData);
      toast.success("Successfully added!");
      setCategoryName("");
      setCategoryDescription("");
      setTimeout(() => {
        navigate("/categorylist");
      }, 1000);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add category"));
    }
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
              className={"text-sm"}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name}</p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel>Category Description</FieldLabel>
            <Textarea
              value={categoryDescription}
              placeholder="Type your description here..."
              className={"resize-none text-sm"}
              onChange={(e) => {
                setCategoryDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description}</p>
            ) : null}
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
