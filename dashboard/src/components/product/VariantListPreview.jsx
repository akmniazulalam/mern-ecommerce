import React from "react";
import { Badge } from "@/components/ui/badge";
import { getVariantSummary } from "@/lib/productVariants";

export default function VariantListPreview({ product }) {
  const variants = product.variants ?? [];

  if (!variants.length) {
    return (
      <p className="text-xs text-muted-foreground mt-3 px-1">
        No variants configured for this product.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground px-0.5">
        Variants
      </p>
      {variants.map((variant) => {
        const rowKey =
          variant._id ||
          `${product._id}-${variant.sku}-${variant.size}-${variant.color}`;

        return (
          <div
            key={rowKey}
            className="flex items-center justify-between gap-3 rounded-lg border bg-muted/10 p-2.5 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={variant.images?.[0]}
                alt={getVariantSummary(variant)}
                className="h-12 w-12 shrink-0 rounded-md border object-cover bg-background"
              />

              <div className="min-w-0 space-y-1.5">
                <p className="text-xs font-medium truncate">
                  {getVariantSummary(variant)}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {variant.color ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5">
                      {variant.color}
                    </Badge>
                  ) : null}
                  {variant.size ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5">
                      {variant.size}
                    </Badge>
                  ) : null}
                  {variant.sku ? (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-5 font-mono">
                      {variant.sku}
                    </Badge>
                  ) : null}
                  {variant.badge ? (
                    <Badge className="text-[10px] px-1.5 py-0 h-5">
                      {variant.badge}
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span>
                    <span className="text-muted-foreground">Price:</span>{" "}
                    <span className="font-semibold">
                      ${Number(variant.price).toFixed(2)}
                    </span>
                  </span>
                  <span>
                    <span className="text-muted-foreground">Stock:</span>{" "}
                    <span
                      className={
                        Number(variant.stock) > 0
                          ? "font-semibold text-emerald-600 dark:text-emerald-400"
                          : "font-semibold text-destructive"
                      }>
                      {variant.stock}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
