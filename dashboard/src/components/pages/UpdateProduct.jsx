import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import ProductVariantEditor from "@/components/product/ProductVariantEditor";
import { getApiErrorMessage, isNotFoundError } from "@/lib/apiErrors";
import {
  mapApiVariantsToForm,
  validateVariantsBeforeSubmit,
} from "@/lib/productVariants";
import {
  fetchCategories,
  fetchProductById,
  updateProduct,
} from "@/services/productService";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setIsNotFound(false);

    try {
      const product = await fetchProductById(id);

      if (!product) {
        setIsNotFound(true);
        return;
      }

      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setCategory(product.category ?? "");
      setVariants(mapApiVariantsToForm(product.variants));
    } catch (error) {
      if (isNotFoundError(error)) {
        setIsNotFound(true);
        return;
      }
      setLoadError(getApiErrorMessage(error, "Failed to load product"));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((error) => {
        toast.error(getApiErrorMessage(error, "Failed to load categories"));
      });
  }, []);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleUpdate = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error("Product name is required");
      return;
    }

    if (!trimmedDescription) {
      toast.error("Description is required");
      return;
    }

    if (!category) {
      toast.error("Category is required");
      return;
    }

    const variantError = validateVariantsBeforeSubmit(variants, { isCreate: false });
    if (variantError) {
      toast.error(variantError);
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProduct(id, {
        name: trimmedName,
        description: trimmedDescription,
        category,
        variants,
      });

      toast.success("Product updated successfully");
      navigate("/productlist");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update product"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading product...
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-semibold">Product not found</h2>
        <p className="text-sm text-muted-foreground">
          This product may have been deleted or the link is invalid.
        </p>
        <Button asChild className="cursor-pointer">
          <Link to="/productlist">Back to products</Link>
        </Button>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-lg font-semibold">Could not load product</h2>
        <p className="text-sm text-muted-foreground">{loadError}</p>
        <div className="flex justify-center gap-2">
          <Button className="cursor-pointer" onClick={loadProduct}>
            Retry
          </Button>
          <Button variant="outline" asChild className="cursor-pointer">
            <Link to="/productlist">Back to list</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Update Product</title>
      </Helmet>

      <div className="max-w-3xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Edit product</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update details and manage variants.
            </p>
          </div>
          <Button variant="outline" asChild className="cursor-pointer">
            <Link to="/productlist">Back to list</Link>
          </Button>
        </div>

        <FieldGroup className="space-y-6">
          <div className="rounded-xl border bg-card p-4 md:p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold">Basic information</h3>

            <Field>
              <FieldLabel className="font-semibold">Product name</FieldLabel>
              <Input
                value={name}
                disabled={isSubmitting}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Description</FieldLabel>
              <Textarea
                value={description}
                className="resize-none min-h-[100px]"
                disabled={isSubmitting}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Category</FieldLabel>
              <Select
                value={category}
                disabled={isSubmitting}
                onValueChange={setCategory}>
                <SelectTrigger className="w-full max-w-xs h-10 cursor-pointer">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((item) => (
                      <SelectItem
                        key={item._id}
                        value={item.name}
                        className="cursor-pointer">
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="rounded-xl border bg-card p-4 md:p-5 shadow-sm">
            <ProductVariantEditor
              variants={variants}
              onChange={setVariants}
              mode="edit"
            />
          </div>

          <Button
            type="button"
            className="w-full sm:w-auto cursor-pointer min-w-[140px]"
            disabled={isSubmitting}
            onClick={handleUpdate}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </FieldGroup>
      </div>
    </>
  );
};

export default UpdateProduct;
