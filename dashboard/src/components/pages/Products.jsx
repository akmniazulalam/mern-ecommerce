import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
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
import ProductVariantEditor from "@/components/product/ProductVariantEditor";
import { getApiErrorMessage } from "@/lib/apiErrors";
import {
  createEmptyVariant,
  validateVariantsBeforeSubmit,
} from "@/lib/productVariants";
import { createProduct, fetchCategories } from "@/services/productService";

const Products = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([createEmptyVariant()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);

    try {
      const list = await fetchCategories();
      setCategories(list);
      if (list.length > 0) {
        setSelectedCategory((current) => current || list[0].name);
      }
    } catch (error) {
      setCategoriesError(getApiErrorMessage(error, "Failed to load categories"));
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateProduct = async () => {
    const trimmedName = productName.trim();
    const trimmedDescription = productDescription.trim();

    if (!trimmedName) {
      toast.error("Product name is required");
      return;
    }

    if (!trimmedDescription) {
      toast.error("Description is required");
      return;
    }

    if (!selectedCategory) {
      toast.error("Category is required");
      return;
    }

    const variantError = validateVariantsBeforeSubmit(variants, { isCreate: true });
    if (variantError) {
      toast.error(variantError);
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct({
        name: trimmedName,
        description: trimmedDescription,
        category: selectedCategory,
        variants,
      });

      toast.success("Product added successfully");

      setProductName("");
      setProductDescription("");
      setVariants([createEmptyVariant()]);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].name);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add product"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || isLoadingCategories || !!categoriesError;

  return (
    <>
      <Helmet>
        <title>Add Product</title>
      </Helmet>

      <div className="max-w-3xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Add product</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create a product and configure one or more variants.
            </p>
          </div>
          <Button variant="outline" asChild className="cursor-pointer">
            <Link to="/productlist">View products</Link>
          </Button>
        </div>

        {categoriesError ? (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-destructive font-medium">{categoriesError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={loadCategories}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        <FieldGroup className="space-y-6">
          <div className="rounded-xl border bg-card p-4 md:p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold">Basic information</h3>

            <Field>
              <FieldLabel className="font-semibold">Product name</FieldLabel>
              <Input
                value={productName}
                placeholder="e.g. Classic Cotton T-Shirt"
                disabled={isFormDisabled}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Description</FieldLabel>
              <Textarea
                value={productDescription}
                placeholder="Describe the product for your storefront..."
                className="resize-none min-h-[100px]"
                disabled={isFormDisabled}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Category</FieldLabel>
              {isLoadingCategories ? (
                <div className="flex items-center text-sm text-muted-foreground h-10">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading categories...
                </div>
              ) : (
                <Select
                  value={selectedCategory}
                  disabled={isFormDisabled || categories.length === 0}
                  onValueChange={setSelectedCategory}>
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
              )}
            </Field>
          </div>

          <div className="rounded-xl border bg-card p-4 md:p-5 shadow-sm">
            <ProductVariantEditor
              variants={variants}
              onChange={setVariants}
              mode="create"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="cursor-pointer min-w-[140px]"
              disabled={isFormDisabled}
              onClick={handleCreateProduct}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish product"
              )}
            </Button>
          </div>
        </FieldGroup>
      </div>
    </>
  );
};

export default Products;
