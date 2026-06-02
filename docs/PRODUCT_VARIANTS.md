# Product variants — system contract

## API base

All clients use `VITE_API_URL` (default: `https://mern-ecommerce-91cv.onrender.com/api/v1`).

## Product shape (response)

```json
{
  "_id": "...",
  "name": "Product name",
  "description": "...",
  "category": "Category name",
  "variants": [
    {
      "_id": "...",
      "sku": "OPTIONAL-SKU",
      "size": "M",
      "color": "Navy",
      "price": 29.99,
      "stock": 10,
      "images": ["https://..."],
      "badge": "New",
      "ram": "",
      "storage": "",
      "attributes": { "material": "cotton" }
    }
  ]
}
```

## Endpoints (legacy + REST aliases)

| Action | Path |
|--------|------|
| List | `GET /product/getproduct` |
| Single | `GET /product/singleproduct/:id` |
| Variants only | `GET /product/:id/variants` |
| Create | `POST /product/createproduct` (multipart) |
| Update | `PATCH /product/updateproduct/:id` (multipart) |
| Delete | `DELETE /product/deleteproduct/:id` |

### Create / update (multipart)

- `name`, `description`, `category` (strings)
- `variants` (JSON string array)
- `images` (files) — one per new variant on create; optional on update with `imageIndexes`

## Cart line (POST `/cart/addtocart`)

Requires session auth.

```json
{
  "productId": "...",
  "variantId": "...",
  "name": "Product name",
  "price": 29.99,
  "image": "https://...",
  "color": "Navy",
  "size": "M",
  "quantity": 1
}
```

Cart lines are unique by `productId` + `variantId` (or `productId` only when `variantId` is omitted).

## Apps

| App | Role |
|-----|------|
| `ecommerceApi` | Source of truth (MongoDB embedded variants) |
| `dashboard` | Admin CRUD via `productService` |
| `Orebi` | Storefront list, detail variant selection, local cart |
