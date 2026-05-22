import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Add Product — Admin" },
      {
        name: "description",
        content: "Create a new product with rich variant options.",
      },
    ],
  }),
  component: ProductsPage,
});

const emptyVariant = () => ({
  color: "",
  size: "",
  ram: "",
  storage: "",
  stock: "",
  price: "",
  badge: "",
  image: null,
});

function Products() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [variants, setVariants] = useState([emptyVariant()]);
  const [getCategory, setGetCategory] = useState([]);

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () =>
    setVariants((prev) => [...prev, emptyVariant()]);

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
      badge: v.badge,
    }));
    formData.append("variants", JSON.stringify(variantData));
    variants.forEach((v) => {
      if (v.image) formData.append("images", v.image);
    });

    try {
      setSubmitting(true);
      await axios.post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/product/createproduct",
        formData
      );
      toast.success("Successfully added!");
      setProductName("");
      setProductDescription("");
      setVariants([emptyVariant()]);
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/category/getallcategory"
      )
      .then((res) => {
        setGetCategory(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedCategory(res.data.data[0].name);
        }
      })
      .catch(() => {});
  }, []);

  const totalStock = variants.reduce(
    (sum, v) => sum + (Number(v.stock) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-sm">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight tracking-tight">
                Add Product
              </h1>
              <p className="text-xs text-muted-foreground">
                Create a new product with variants
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              {variants.length} variant{variants.length === 1 ? "" : "s"}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {totalStock} in stock
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Intro */}
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Product details
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the core information. You can add multiple variants below.
            </p>
          </div>
        </div>

        {/* Core info card */}
        <Card className="p-6 md:p-8 shadow-sm border-border/70">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="name" className="text-sm font-medium">
                Product name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Aurora Wireless Headphones"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {getCategory.map((item) => (
                      <SelectItem key={item._id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="desc"
                placeholder="Describe what makes this product special…"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Variants */}
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Variants</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add color, size, storage, pricing and image per variant.
              </p>
            </div>
            <Button
              onClick={handleAddVariant}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add variant
            </Button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <Card
                key={index}
                className="p-6 border-border/70 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">
                      Variant {index + 1}
                    </span>
                    {variant.badge && (
                      <Badge variant="secondary" className="ml-1">
                        {variant.badge}
                      </Badge>
                    )}
                  </div>
                  {variants.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Field label="Color">
                    <Input
                      placeholder="e.g. Midnight Black"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Size">
                    <Input
                      placeholder="e.g. M / 42"
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="RAM">
                    <Input
                      placeholder="e.g. 8GB"
                      value={variant.ram}
                      onChange={(e) =>
                        handleVariantChange(index, "ram", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Storage">
                    <Input
                      placeholder="e.g. 256GB"
                      value={variant.storage}
                      onChange={(e) =>
                        handleVariantChange(index, "storage", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Stock">
                    <Input
                      type="number"
                      placeholder="0"
                      min={0}
                      value={variant.stock}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(e) => {
                        if (Number(e.target.value) >= 0) {
                          handleVariantChange(index, "stock", e.target.value);
                        }
                      }}
                    />
                  </Field>
                  <Field label="Price">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        placeholder="0.00"
                        value={variant.price}
                        className="pl-7"
                        onChange={(e) =>
                          handleVariantChange(index, "price", e.target.value)
                        }
                      />
                    </div>
                  </Field>
                  <Field label="Badge">
                    <Input
                      placeholder="e.g. New, Sale"
                      value={variant.badge}
                      onChange={(e) =>
                        handleVariantChange(index, "badge", e.target.value)
                      }
                    />
                  </Field>

                  <Field
                    label="Variant image"
                    className="md:col-span-2 lg:col-span-2"
                  >
                    <label
                      htmlFor={`image-${index}`}
                      className="group flex items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 hover:bg-muted/50 px-4 py-2.5 cursor-pointer transition-colors"
                    >
                      <div className="h-9 w-9 rounded-md bg-background border border-border grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
                        {variant.image ? (
                          <ImageIcon className="h-4 w-4 text-primary" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {variant.image
                            ? variant.image.name
                            : "Click to upload an image"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or WEBP
                        </p>
                      </div>
                      <input
                        id={`image-${index}`}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "image",
                            e.target.files?.[0] ?? null
                          )
                        }
                      />
                    </label>
                  </Field>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Submit */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-12">
          <p className="text-sm text-muted-foreground">
            Review all fields before publishing. You can edit the product later.
          </p>
          <Button
            onClick={handleCreateProduct}
            disabled={submitting}
            size="lg"
            className="gap-2 min-w-44"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Adding…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add product
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default Products;
