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
import { useAuth } from "@/context/AuthContext";
import { DEMO_READ_ONLY_MESSAGE } from "@/lib/demoMode";

const UpdateCategory = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [updateName, setUpdateName] = useState("");
  const [updateDes, setUpdateDes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get(categoryPaths.single(id))
      .then((res) => {
        setUpdateName(res.data.data?.name || "");
        setUpdateDes(res.data.data?.description || "");
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err, "Failed to load category details"));
      });
  }, [id]);

  const handleUpdateCategory = async () => {
    if (user?.isDemoAdmin) {
      toast.error(DEMO_READ_ONLY_MESSAGE);
      return;
    }

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
      setIsSubmitting(true);
      await apiClient.patch(categoryPaths.update(id), formData);
      toast.success("Successfully Updated");
      setUpdateName("");
      setUpdateDes("");
      setTimeout(() => {
        navigate("/categorylist");
      }, 1000);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update category"));
    } finally {
      setIsSubmitting(false);
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
            <FieldLabel htmlFor="update-category-name">Update Category Name</FieldLabel>
            <Input
              id="update-category-name"
              value={updateName}
              placeholder="Update Category Name"
              disabled={isSubmitting || user?.isDemoAdmin}
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
            <FieldLabel htmlFor="update-category-des">Update Category Description</FieldLabel>
            <Textarea
              id="update-category-des"
              value={updateDes}
              placeholder="Type your description here..."
              className={"resize-none"}
              disabled={isSubmitting || user?.isDemoAdmin}
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
            <Button
              onClick={handleUpdateCategory}
              disabled={isSubmitting || user?.isDemoAdmin}
              title={user?.isDemoAdmin ? DEMO_READ_ONLY_MESSAGE : undefined}
              className={"cursor-pointer"}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default UpdateCategory;
