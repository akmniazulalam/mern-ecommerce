# MERN E-Commerce Platform

A full-stack e-commerce application built with the MERN stack. The platform is split into three coordinated applications: a Node/Express backend API, a React admin dashboard, and a React customer storefront.

The project supports product and variant management, category management, coupons, cart and checkout, customer order history, admin order fulfillment, user management, authentication, file uploads, and production-oriented API validation/error handling.

## Architecture

```txt
Customer Storefront (Orebi)
        |
        | HTTP + session cookies
        v
Backend API (ecommerceApi) ---- MongoDB Atlas / MongoDB
        |
        | Cloudinary uploads, Resend email
        v
Admin Dashboard (dashboard)
```

- `ecommerceApi` is the source of truth for products, users, categories, coupons, cart records, and orders.
- `dashboard` is the admin-facing data management application.
- `Orebi` is the customer-facing shopping experience.
- Both frontend apps call the same backend API through centralized Axios clients.
- Admin-only backend routes are protected with authentication and role authorization middleware.

## Folder Structure

```txt
mern-ecom/
  ecommerceApi/
    src/
      common/
        config/              # Database, Cloudinary, environment loading
        middleware/          # Global error handling, async wrapper, validation helpers
        utils/               # Email and validation utilities
      modules/
        auth/                # Signup, login, OTP, sessions, user management
        cart/                # Cart persistence and cart validation
        category/            # Categories and subcategories
        coupon/              # Coupon CRUD and coupon application
        order/               # Checkout, order history, admin fulfillment
        product/             # Product CRUD, variants, uploads, search/filtering
      routes/                # API route composition
      app.js                 # Express app setup
    server.js                # API entry point
    sample.env               # Backend environment template

  dashboard/
    src/
      components/
        layout/              # Admin layout, navbar, sidebar
        pages/               # Admin pages
        product/             # Product variant admin components
        ui/                  # Shared UI primitives
      context/               # Auth context
      lib/                   # API client, paths, utilities
      services/              # Admin service functions
    .env.example             # Dashboard environment template

  docs/
    PRODUCT_VARIANTS.md      # Product variant behavior notes

../Orebi/
  src/
    components/
      layouts/               # Storefront layout sections
      pages/                 # Storefront pages
      ui/                    # UI primitives
    lib/                     # API client, API paths, cart/product helpers
    services/                # Product service functions
    store/                   # Zustand cart store
  .env.example               # Storefront environment template
```

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB / Mongoose
- Express Session with Mongo-backed session storage
- JWT support
- Multer
- Cloudinary
- Resend / Nodemailer
- Centralized validation and error handling

### Admin Dashboard

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- shadcn-style UI primitives
- Lucide React icons
- React Hot Toast

### Customer Storefront

- React
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS
- Base UI primitives
- Lucide React icons
- React Slick
- React Hot Toast

## Features

### Customer Storefront

- Product listing and product details
- Product variants with size, color, SKU, price, stock, images, and attributes
- Cart management
- Quantity increase/decrease
- Coupon application
- Checkout and order creation
- Order success page
- Customer order history
- Customer order details page
- Responsive storefront pages

### Admin Dashboard

- Protected admin dashboard
- Product CRUD
- Product variant management
- Category CRUD
- Subcategory management
- Coupon CRUD
- Orders list
- Order details
- Order status updates
- User management
- Admin authentication

### Backend API

- Session-based authentication
- Admin authorization middleware
- Product CRUD with image uploads
- Product search, filtering, sorting, and pagination
- Category and subcategory APIs
- Coupon creation, listing, deletion, and application
- Cart APIs
- Checkout and order APIs
- Customer order history APIs
- Admin order management APIs
- Centralized request validation
- Centralized error handling
- Required environment variable validation

## Installation

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB database
- Cloudinary account
- Resend account or SMTP-compatible email provider

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-ecom
```

If using the storefront as a sibling project, keep this workspace layout:

```txt
Desktop/
  mern-ecom/
    ecommerceApi/
    dashboard/
  Orebi/
```

### 2. Install Backend Dependencies

```bash
cd ecommerceApi
npm install
```

### 3. Install Admin Dashboard Dependencies

```bash
cd ../dashboard
npm install
```

### 4. Install Storefront Dependencies

```bash
cd ../../Orebi
npm install
```

## Environment Variables

Never commit real `.env` files. Use the example files as templates.

### Backend: `ecommerceApi/.env`

```env
DB_URL=mongodb+srv://<user>:<password>@<cluster>/<database>?appName=<app-name>
SESSION_SECRET=<replace-with-a-long-random-session-secret>
JWT_SECRET=<replace-with-a-long-random-jwt-secret>
CLOUD_NAME=<cloudinary-cloud-name>
API_KEY=<cloudinary-api-key>
API_SECRET=<cloudinary-api-secret>
RESEND_API_KEY=<resend-api-key>
PORT=3000
NODE_ENV=development
```

### Admin Dashboard: `dashboard/.env`

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Customer Storefront: `Orebi/.env`

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_NEW_ARRIVALS_API_URL=<public-product-feed-url>
VITE_BEST_SELLERS_API_URL=<public-product-feed-url>
VITE_SPECIAL_OFFERS_API_URL=<public-product-feed-url>
```

## Running Locally

### Backend API

```bash
cd ecommerceApi
npm run dev
```

Default local API:

```txt
http://localhost:3000/api/v1
```

### Admin Dashboard

```bash
cd dashboard
npm run dev
```

### Customer Storefront

```bash
cd ../Orebi
npm run dev
```

## Build

### Admin Dashboard

```bash
cd dashboard
npm run build
```

### Customer Storefront

```bash
cd ../Orebi
npm run build
```

## Deployment

### Backend API

The backend can be deployed to platforms such as Render, Railway, Fly.io, or a VPS.

Required deployment configuration:

- Set all backend environment variables.
- Allow frontend origins in CORS configuration.
- Use a production MongoDB connection string.
- Use strong `SESSION_SECRET` and `JWT_SECRET` values.
- Configure Cloudinary credentials.
- Configure email provider credentials.
- Run the app with:

```bash
npm start
```

### Admin Dashboard

The dashboard can be deployed to Vercel, Netlify, or any static hosting provider.

Required deployment configuration:

- Set `VITE_API_URL` to the production backend URL.
- Build command: `npm run build`
- Output directory: `dist`

### Customer Storefront

The storefront can be deployed to Vercel, Netlify, or any static hosting provider.

Required deployment configuration:

- Set `VITE_API_URL` to the production backend URL.
- Set homepage feed URLs if those sections are enabled.
- Build command: `npm run build`
- Output directory: `dist`

## Screenshots

Add production screenshots in `docs/screenshots/`.

| Area | Screenshot |
| --- | --- |
| Customer Home | `docs/screenshots/customer-home.png` |
| Product Details | `docs/screenshots/product-details.png` |
| Cart | `docs/screenshots/cart.png` |
| Checkout | `docs/screenshots/checkout.png` |
| Order Success | `docs/screenshots/order-success.png` |
| Customer Orders | `docs/screenshots/customer-orders.png` |
| Admin Dashboard | `docs/screenshots/admin-dashboard.png` |
| Product Management | `docs/screenshots/product-management.png` |
| Order Management | `docs/screenshots/order-management.png` |

## API Overview

Base URL:

```txt
/api/v1
```

### Auth

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Create user and send OTP | Public |
| POST | `/auth/otpverify` | Verify signup OTP | Public |
| POST | `/auth/resendotp` | Resend OTP | Public |
| POST | `/auth/login` | Log in user | Public |
| POST | `/auth/logout` | Log out user | Public |
| GET | `/auth/currentuser` | Get current session user | Public/session |
| GET | `/auth/userlist` | List users | Admin |
| DELETE | `/auth/deleteuser/:id` | Delete user | Admin |
| GET | `/auth/dashboard` | Admin dashboard auth check | Admin |
| POST | `/auth/upload-avatar` | Upload user avatar | Authenticated |

### Products

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/product/getproduct` | List products with search/filter/sort/pagination | Public |
| GET | `/product` | REST alias for product list | Public |
| GET | `/product/singleproduct/:id` | Get one product | Public |
| GET | `/product/:id` | REST alias for one product | Public |
| GET | `/product/:id/variants` | Get product variants | Public |
| POST | `/product/createproduct` | Create product | Admin |
| POST | `/product` | REST alias for create product | Admin |
| PATCH | `/product/updateproduct/:id` | Update product | Admin |
| PATCH | `/product/:id` | REST alias for update product | Admin |
| DELETE | `/product/deleteproduct/:id` | Delete product | Admin |
| DELETE | `/product/:id` | REST alias for delete product | Admin |
| DELETE | `/product/deleteallproduct` | Delete all products | Admin |
| DELETE | `/product/all` | REST alias for delete all products | Admin |

Supported product list query parameters:

```txt
page=1
limit=12
search=shirt
category=Electronics
sort=latest | oldest | name-asc | name-desc | price-asc | price-desc | stock-asc | stock-desc
minPrice=20
maxPrice=100
stock=all | in-stock | out-of-stock | 5
```

### Categories

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/category/getallcategory` | List categories | Public |
| GET | `/category/getallsubcategory` | List subcategories | Public |
| GET | `/category/singlecategory/:id` | Get one category | Public |
| POST | `/category/createcategory` | Create category | Admin |
| POST | `/category/createsubcategory` | Create subcategory | Admin |
| PATCH | `/category/updatecategory/:id` | Update category | Admin |
| DELETE | `/category/deletecategory/:id` | Delete category | Admin |
| DELETE | `/category/deleteallcategory` | Delete all categories | Admin |
| DELETE | `/category/deleteallsubcategory` | Delete all subcategories | Admin |

### Cart

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/cart/addtocart` | Add product variant to cart | Session |
| GET | `/cart/allcart` | View all cart records | Admin |

### Coupons

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/coupon/apply-coupon` | Apply coupon during cart/checkout | Public |
| POST | `/coupon/create-coupon` | Create coupon | Admin |
| GET | `/coupon/couponlist` | List coupons | Admin |
| DELETE | `/coupon/deletecoupon/:id` | Delete coupon | Admin |

### Orders

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/order/create` | Create order from checkout | Public/session |
| GET | `/order/mine` | Customer order history | Authenticated |
| GET | `/order/admin` | Admin order list | Admin |
| GET | `/order/:id` | Get order details | Owner/Admin |
| PATCH | `/order/:id/status` | Update order status | Owner/Admin rules |

## Response Shape

Typical successful response:

```json
{
  "message": "Success",
  "data": {}
}
```

Product list responses include pagination/filter metadata:

```json
{
  "message": "Success",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false,
    "filters": {
      "search": "",
      "category": "",
      "sort": "latest",
      "minPrice": null,
      "maxPrice": null,
      "stock": "all"
    }
  }
}
```

Typical error response:

```json
{
  "message": "Validation message",
  "field": "fieldName"
}
```

## Security Notes

- Admin write routes require authentication and admin authorization.
- Secrets are read from environment variables.
- Server startup validates required backend environment variables.
- File uploads are handled through configured upload middleware and Cloudinary.
- Request validation is applied to core write and query endpoints.
- Production deployments should use HTTPS and secure cookie/session settings.

## License

This project is currently marked as ISC in the backend package metadata.
