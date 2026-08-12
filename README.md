# Game_Store_MERN

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

A full-stack e-commerce platform for gaming products, built with a Node.js + Express backend and a React + Vite frontend. The application facilitates product browsing, cart management, checkout, user authentication, order placement, notifications, reviews, and includes an admin dashboard for managing products, users, orders, and store operations.

## Table of Contents

- [Project Title](#game_store_mern)
- [Badges](#badges)
- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack--key-dependencies)
- [File Structure Overview](#file-structure-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage / Getting Started](#usage--getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Author/Acknowledgements](#authoracknowledgements)
- [Contact](#contact)

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

## Tech Stack / Key Dependencies

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

## File Structure Overview

```text
Game_Store_MERN/
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
│   └── .env.example
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
├── docs/
│   └── workflow.md
├── .gitignore
├── LICENSE
└── README.md
```

## Prerequisites

Before running the project locally, ensure you have:

- Node.js v18+ or newer
- npm or yarn
- MongoDB running locally or a MongoDB Atlas connection string
- Cloudinary account for product image uploads
- Gmail account with an app password for email sending

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Ali1180-uni/Game_Store_MERN.git
    cd Game_Store_MERN
    ```

2.  **Install backend dependencies:**

    ```bash
    cd Backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../Frontend
    npm install
    ```

## Usage / Getting Started

### Start the backend

```bash
cd Backend
npm run dev
```

The backend runs with `tsx watch`, automatically restarting during development when files change. It typically runs on `http://localhost:5000`.

### Start the frontend

```bash
cd Frontend
npm run dev
```

The frontend usually runs on `http://localhost:5173`.

### Building for Production

**Backend build:**

```bash
cd Backend
npm run build
npm start
```

**Frontend build:**

```bash
cd Frontend
npm run build
```

To preview the production frontend build:

```bash
npm run preview
```

## Configuration

Create a `.env` file in the `Backend` folder and populate it with your environment variables. An example file `.env.example` is provided:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/game-store
JWT_SECRET=your_jwt_secret_here
OTP_SECRET=your_otp_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

USER=your_email@gmail.com
PASS=your_google_app_password
```

**Frontend Configuration:**

If your frontend needs a custom API base URL, create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

## API Reference

The backend exposes several API groups:

### Authentication

- `POST /auth/register`
- `POST /auth/login`

### Products

- `GET /products`
- `GET /products/:id`

### Reviews

- `GET /reviews/:productId`
- `POST /reviews`

### Addresses

- `GET /addresses`
- `POST /addresses`

### Orders

- `POST /orders`
- `GET /orders/:id`

### Notifications

- `GET /notifications`
- `PATCH /notifications/:id/read`

### OTP

- `POST /otp/send`
- `POST /otp/verify`

### Admin Routes

- `GET /admin/stats`
- `GET /admin/users`
- `PATCH /admin/users/:id/ban`
- `PATCH /admin/users/:id/role`
- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `PATCH /admin/products/:id/stock`
- `DELETE /admin/products/:id`

> Most protected endpoints require a valid JWT token.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'
`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes relevant tests.

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Author/Acknowledgements

Ali1180-uni - Initial work

## Contact

[Your Name] - projectlink - email@example.com

