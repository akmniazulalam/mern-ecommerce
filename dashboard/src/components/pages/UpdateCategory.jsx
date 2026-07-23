import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import apiClient from "@/lib/apiClient";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { categoryPaths } from "@/lib/productApi";

const UpdateCategory = () => {
  const { id } = useParams();
  const [updateName, setUpdateName] = useState("");
  const [updateDes, setUpdateDes] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    apiClient
      .get(categoryPaths.single(id))
      .then((res) => {
        setUpdateName(res.data.data.name);
        setUpdateDes(res.data.data.description);
      });
  }, []);

  const handleUpdateCategory = async () => {
    const formData = {
      name: updateName,
      description: updateDes,
    };
    const nextErrors = {};

    if (!updateName.trim()) {
      nextErrors.name = "Category name is required";
    }

    if (!updateDes.trim()) {
      nextErrors.description = "Category description is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await apiClient.patch(categoryPaths.update(id), formData);
      toast.success("Successfully Updated");
      setUpdateName("");
      setUpdateDes("");
      setTimeout(() => {
        navigate("/categorylist");
      }, 1000);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update category"));
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Category</title>
      </Helmet>

      <h3 className="font-bold">Update Category</h3>
      <div className="md:max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Update Category Name</FieldLabel>
            <Input
              value={updateName}
              placeholder="Update Category Name"
              onChange={(e) => {
                setUpdateName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name}</p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel>Update Category Description</FieldLabel>
            <Textarea
              value={updateDes}
              placeholder="Type your description here..."
              className={"resize-none"}
              onChange={(e) => {
                setUpdateDes(e.target.value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description}</p>
            ) : null}
          </Field>
          <Field orientation="horizontal">
            <Button onClick={handleUpdateCategory} className={"cursor-pointer"}>
              Update Category
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default UpdateCategory;
