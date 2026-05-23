# Library API

A RESTful backend API for managing a library system with user authentication, book management, categories, profiles, and borrowings.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Logging & Error Handling](#logging--error-handling)
- [Project Structure](#project-structure)
- [Notes](#notes)

## Project Overview

- **Name:** LibraryAPI
- **Version:** 1.0.0
- **Description:** Primakara Developers 2026 Intermediate Class Back-End Project
- **Author:** Joshua Kevin Wijaya
- **License:** ISC

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Auth:** bcryptjs / JSON Web Tokens
- **Logging:** Pino & Pino-pretty
- **Cloud Storage:** Cloudinary (for book covers)
- **Validation:** Express-validator

## Features

- **Authentication:** Secure registration and login with JWT.
- **Authorization:** Role-based access control (Admin/User).
- **Books:** Complete CRUD with cover image upload to Cloudinary.
- **Categories:** Group books into categories.
- **Profiles:** Detailed user profiles linked to accounts.
- **Borrowings:** Track book loans, manage availability, and handle returns.
- **Logging:** Comprehensive system logs for debugging and monitoring.

## Requirements

- Node.js 16+
- PostgreSQL database
- Cloudinary Account (for image uploads)
- npm

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd libraryapi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/librarydb"
   PORT=3000
   JWT_SECRET="your_secret_key"
   BCRYPT_SALT_ROUNDS=10
   
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   
   LOG_LEVEL="debug"
   ```

4. Run Prisma migrations and generate the client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed the database (optional):
   ```bash
   npm run seed
   ```

## Scripts

- `npm run dev` — start the app with `nodemon`
- `npm run seed` — run the Prisma seed script

## API Endpoints

### Authentication
- `POST /auth/register` — register a new user
- `POST /auth/login` — login and receive a JWT

### Users (Admin Only)
- `GET /users` — get all users
- `GET /users/:id` — get user by ID
- `GET /users/:id/profile` — get user with profile data
- `POST /users` — create a user
- `PUT /users/:id` — update user (including password hashing)
- `DELETE /users/:id` — delete user

### Books
- `GET /books` — get all books (includes cover URLs)
- `GET /books/:id` — get a book by ID
- `POST /books` — create a book (supports file upload)
- `PUT /books/:id` — update a book (manages old cover deletion)
- `DELETE /books/:id` — delete a book

### Categories
- `GET /categories` — get all categories
- `GET /categories/:id` — get a category by ID
- `GET /categories/:id/books` — get books in a category
- `POST /categories` — create a category
- `PUT /categories/:id` — update a category
- `DELETE /categories/:id` — delete a category

### Profiles
- `GET /profiles` — get all profiles
- `GET /profiles/:id` — get a profile by ID
- `POST /profiles` — create a profile for a user
- `PUT /profiles/:id` — update a profile
- `DELETE /profiles/:id` — delete a profile

### Borrowings
- `GET /borrowings` — get all borrowings (includes user and book info)
- `GET /borrowings/:id` — get a borrowing by ID
- `POST /borrowings` — create a borrowing record (automatically marks book unavailable)
- `PUT /borrowings/:id` — update a borrowing record (handles book availability swaps)
- `PUT /borrowings/:id/return` — return a book (marks book available)
- `DELETE /borrowings/:id` — delete a borrowing record

## Authentication

- Protect routes with JWT.
- Send tokens using the header:
  ```http
  Authorization: Bearer <token>
  ```
- Admin-only routes are protected by `admin.middleware.js`.

## Logging & Error Handling

The project uses **Pino** for high-performance logging. All controller actions are wrapped in `try-catch` blocks to ensure:
- **Global Error Handling:** All errors return a standardized `500` JSON response.
- **Traceability:** Errors are logged with full stack traces for easier debugging.
- **Activity Monitoring:** Key actions (CRUD operations) are logged at `info` level, while detailed flow is at `debug` level.

## Project Structure

```
libraryapi/
├── configs/           # Database, Cloudinary, and Logger configurations
├── controllers/       # Business logic for each resource
├── generated/         # Generated Prisma client
├── middlewares/       # JWT and Admin authorization middlewares
├── prisma/            # Schema, migrations, and seed script
├── routes/            # Route definitions and mapping
├── validations/       # Input validation schemas (Express-validator)
├── index.js           # Main application entry point
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

## Notes

- Server listens on `http://localhost:3000` by default.
- Use the `/auth` routes to obtain a valid JWT before calling protected routes.
- Ensure Cloudinary credentials are correct for book cover uploads to work.
