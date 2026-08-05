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
import { useAuth } from "@/context/AuthContext";
import { DEMO_READ_ONLY_MESSAGE } from "@/lib/demoMode";

const Category = () => {
  const { user } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const formData = {
    name: categoryName,
    description: categoryDescription,
  };
  const handleCreateCategory = async () => {
    if (user?.isDemoAdmin) {
      toast.error(DEMO_READ_ONLY_MESSAGE);
      return;
    }

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
      setIsSubmitting(true);
      await apiClient.post(categoryPaths.create, formData);
      toast.success("Successfully added!");
      setCategoryName("");
      setCategoryDescription("");
      setTimeout(() => {
        navigate("/categorylist");
      }, 1000);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add category"));
    } finally {
      setIsSubmitting(false);
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
            <FieldLabel htmlFor="create-category-name">Category Name</FieldLabel>
            <Input
              id="create-category-name"
              value={categoryName}
              placeholder="Category Name"
              className={"text-sm"}
              disabled={isSubmitting || user?.isDemoAdmin}
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
            <FieldLabel htmlFor="create-category-description">Category Description</FieldLabel>
            <Textarea
              id="create-category-description"
              value={categoryDescription}
              placeholder="Type your description here..."
              className={"resize-none text-sm"}
              disabled={isSubmitting || user?.isDemoAdmin}
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
            <Button
              onClick={handleCreateCategory}
              disabled={isSubmitting || user?.isDemoAdmin}
              title={user?.isDemoAdmin ? DEMO_READ_ONLY_MESSAGE : undefined}
              className={"cursor-pointer"}>
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default Category;
