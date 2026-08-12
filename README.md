# Game Store MERN

A full-stack e-commerce platform for gaming products, built with a Node.js + Express backend and a React + Vite frontend. The app includes product browsing, cart management, checkout, user authentication, order placement, notifications, reviews, and an admin dashboard for managing products, users, orders, and store actions.

## Overview

This project is designed as a game store and accessories marketplace. Customers can browse products by category, view details, add items to the cart, checkout, and place orders. Admin users can manage inventory, customer accounts, and store activities through the dashboard.

The system includes:

- Product catalog with category filtering
- Product detail pages
- User registration and login
- JWT-based authenticated routes
- Cart and checkout flow
- Order creation and validation
- Address management
- Notification system
- Customer review submission
- OTP email verification
- Admin dashboard with stats and management tools

---

## Tech Stack

### Frontend
- React 19
- Vite
- TypeScript
- React Router
- Redux Toolkit
- Tailwind CSS
- MUI components
- Axios
- React Hot Toast
- Framer Motion

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- Bcrypt password hashing
- Cloudinary image uploads
- Nodemailer email sending
- Express rate limiting

---

## Project Structure

```text
Game Store MERN/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── Middleware/
│   │   ├── Models/
│   │   ├── Routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example (recommended to create)
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
├── docs/
│   └── workflow.md
├── LICENSE
└── README.md
```

---

## Features

### Customer Features
- Browse games and accessories
- View product details and technical info
- Add products to a cart
- Create and manage delivery addresses
- Checkout with order validation
- View order details after purchase
- Receive notifications related to orders and account activity
- Submit reviews and ratings for products
- Email OTP verification during authentication workflows

### Admin Features
- View dashboard statistics
- Manage user roles and account status
- Ban or unban users
- Add, update, and view products
- Upload product images to Cloudinary
- Review product stock and availability
- Send notifications to users from the admin panel
- Manage orders and user reviews

---

## API Overview

The backend runs on port 5000 and exposes the following API groups:

### Authentication
- POST /auth/register
- POST /auth/login

### Products
- GET /products
- GET /products/:id

### Reviews
- GET /reviews/:productId
- POST /reviews

### Addresses
- GET /addresses
- POST /addresses

### Orders
- POST /orders
- GET /orders/:id

### Notifications
- GET /notifications
- PATCH /notifications/:id/read

### OTP
- POST /otp/send
- POST /otp/verify

### Admin Routes
- GET /admin/stats
- GET /admin/users
- PATCH /admin/users/:id/ban
- PATCH /admin/users/:id/role
- GET /admin/products
- POST /admin/products
- PUT /admin/products/:id
- PATCH /admin/products/:id/stock
- DELETE /admin/products/:id

> Most protected endpoints require a valid JWT token and are accessed through authenticated user sessions.

---

## Prerequisites

Before running the project locally, make sure you have:

- Node.js v18+ or newer
- npm or yarn
- MongoDB running locally or a MongoDB Atlas connection string
- Cloudinary account for product image uploads
- Gmail account with an app password for email sending

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "Game Store MERN"
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

---

## Environment Variables

Create a `.env` file in the `Backend` folder and add the required configuration:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/game-store
JWT_SECRET=your_jwt_secret_here
OTP_SECRET=your_otp_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

USER=your_email@gmail.com
PASS=your_google_app_password

# Optional payment-related values if used by payment integrations
JAZZCASH_MERCHANT_ID=your_merchant_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGRITY_SALT=your_salt
JAZZCASH_RETURN_URL=http://localhost:5173/payment-success
```

### Important notes
- `MONGODB_URI` is mandatory for database connectivity.
- `JWT_SECRET` secures authentication tokens.
- `OTP_SECRET` secures the email verification code flow.
- `USER` and `PASS` are used for SMTP email sending.
- Cloudinary variables are required for image upload functionality.

If your frontend needs a custom API base URL, you can add a Vite environment file in `Frontend` such as:

```env
VITE_API_URL=http://localhost:5000
```

> The current frontend code is configured with a fixed base URL in its API layer (`http://localhost:5000`), so this is optional unless you want to centralize configuration.

---

## Running the Project

### Start the backend

```bash
cd Backend
npm run dev
```

The backend runs with `tsx watch`, so it will automatically restart during development when files change.

### Start the frontend

```bash
cd Frontend
npm run dev
```

The frontend usually runs on:

- http://localhost:5173

The backend API typically runs on:

- http://localhost:5000

---

## Production Build

### Backend build

```bash
cd Backend
npm run build
npm start
```

### Frontend build

```bash
cd Frontend
npm run build
```

To preview the production frontend build:

```bash
npm run preview
```

---

## User Flow

A typical shopping flow in this app looks like this:

1. User lands on the home page and browses products.
2. User opens a product and checks details.
3. User adds items to the cart.
4. User logs in or registers if required.
5. User selects or creates a shipping address.
6. User proceeds to checkout.
7. An order is created and stock is validated.
8. User receives a confirmation notification.
9. Admin can process, update, and monitor the order.
10. Customer can leave a product review after purchase.

---

## Admin Workflow

The admin dashboard supports:

- viewing store statistics
- managing users and roles
- banning accounts
- managing inventory and stock
- editing products and images
- reviewing customer feedback
- sending notifications to users
- viewing and updating order-related data

---

## Notes

- The project uses `withCredentials: true` in the frontend API layer, so cookies or credential-aware requests are enabled where applicable.
- The backend applies rate limiting for general traffic and auth endpoints.
- Product image uploads are handled through Cloudinary.
- The app is structured for a modern MERN-style development workflow with clear separation between frontend and backend responsibilities.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Summary

This repository delivers a complete gaming store application with a production-style structure, secure authentication, database-backed product management, checkout logic, notification support, and admin controls. It is a strong foundation for a real-world e-commerce project and can be extended with payment gateways, order tracking, wishlists, and more advanced analytics.
