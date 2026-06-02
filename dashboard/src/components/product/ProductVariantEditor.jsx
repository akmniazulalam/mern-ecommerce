import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createEmptyVariant } from "@/lib/productVariants";
import { cn } from "@/lib/utils";

const numberInputClass =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

function VariantImagePreview({ variant, mode }) {
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (!(variant.image instanceof File)) {
      setFilePreview(null);
      return undefined;
    }

    const url = URL.createObjectURL(variant.image);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [variant.image]);

  const previewUrl = filePreview || variant.images?.[0];

  if (!previewUrl) {
    return (
      <div className="flex h-28 w-full items-center justify-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground">
        <div className="flex flex-col items-center gap-1 text-xs">
          <ImagePlus className="h-5 w-5" />
          <span>{mode === "create" ? "Upload variant image" : "No image yet"}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={previewUrl}
      alt="Variant preview"
      className="h-28 w-full rounded-lg border object-cover"
    />
  );
}

export default function ProductVariantEditor({
  variants,
  onChange,
  mode = "create",
  minVariants = 1,
}) {
  const [expandedAdvanced, setExpandedAdvanced] = useState({});

  const updateVariants = (updater) => {
    onChange(typeof updater === "function" ? updater(variants) : updater);
  };

  const handleVariantChange = (index, field, value) => {
    updateVariants((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddVariant = () => {
    updateVariants([...variants, createEmptyVariant()]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length <= minVariants) {
      return;
    }
    updateVariants(variants.filter((_, i) => i !== index));
  };

  const toggleAdvanced = (key) => {
    setExpandedAdvanced((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Product variants</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Each variant has its own price, stock, and image.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {variants.length} {variants.length === 1 ? "variant" : "variants"}
        </Badge>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => {
          const rowKey = variant.clientKey || variant._id || index;
          const showAdvanced = expandedAdvanced[rowKey];

          return (
            <Card key={rowKey} className="overflow-hidden border shadow-sm py-0 gap-0">
              <CardHeader className="flex flex-row items-center justify-between gap-2 border-b bg-muted/20 px-4 py-3">
                <CardTitle className="text-sm font-semibold">
                  Variant {index + 1}
                  {variant.sku ? (
                    <span className="ml-2 font-normal text-muted-foreground">
                      ({variant.sku})
                    </span>
                  ) : null}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive cursor-pointer"
                  disabled={variants.length <= minVariants}
                  onClick={() => handleRemoveVariant(index)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_140px] gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel>Color</FieldLabel>
                      <Input
                        placeholder="e.g. Navy"
                        value={variant.color ?? ""}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Size</FieldLabel>
                      <Input
                        placeholder="e.g. M, 42, 256GB"
                        value={variant.size ?? ""}
                        onChange={(e) =>
                          handleVariantChange(index, "size", e.target.value)
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>SKU (optional)</FieldLabel>
                      <Input
                        placeholder="e.g. TEE-NAVY-M"
                        value={variant.sku ?? ""}
                        onChange={(e) =>
                          handleVariantChange(index, "sku", e.target.value)
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Price ($)</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        className={numberInputClass}
                        value={variant.price ?? ""}
                        onChange={(e) =>
                          handleVariantChange(index, "price", e.target.value)
                        }
                      />
                    </Field>

                    <Field className="sm:col-span-2">
                      <FieldLabel>Stock</FieldLabel>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Units in stock"
                        className={numberInputClass}
                        value={variant.stock ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || Number(value) >= 0) {
                            handleVariantChange(index, "stock", value);
                          }
                        }}
                      />
                    </Field>
                  </div>

                  <div className="space-y-2">
                    <VariantImagePreview variant={variant} mode={mode} />
                    <Field>
                      <FieldLabel className="text-xs">Variant image</FieldLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        className="text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleVariantChange(index, "image", file);
                          }
                        }}
                      />
                    </Field>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => toggleAdvanced(rowKey)}>
                    {showAdvanced ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                    More options (RAM, storage, badge)
                  </button>

                  {showAdvanced ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-dashed">
                      <Field>
                        <FieldLabel>RAM</FieldLabel>
                        <Input
                          placeholder="e.g. 8GB"
                          value={variant.ram ?? ""}
                          onChange={(e) =>
                            handleVariantChange(index, "ram", e.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Storage</FieldLabel>
                        <Input
                          placeholder="e.g. 256GB"
                          value={variant.storage ?? ""}
                          onChange={(e) =>
                            handleVariantChange(index, "storage", e.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Badge</FieldLabel>
                        <Input
                          placeholder="e.g. New, Sale"
                          value={variant.badge ?? ""}
                          onChange={(e) =>
                            handleVariantChange(index, "badge", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full border-dashed cursor-pointer",
          "hover:bg-muted/50",
        )}
        onClick={handleAddVariant}>
        <Plus className="h-4 w-4 mr-2" />
        Add another variant
      </Button>
    </div>
  );
}
