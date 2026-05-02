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
- [Project Structure](#project-structure)
- [Notes](#notes)

## Project Overview

- **Name:** LibraryAPI
- **Version:** 1.0.0
- **Description:** Primakara Developers 2026 Intermediate Class Back-End Project
- **Author:** Joshua Kevin Wijaya
- **License:** ISC

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- bcrypt / JSON Web Tokens
- Nodemon (development)

## Features

- User authentication and registration
- JWT-based authorization
- Role-based access control
- Book catalog management
- Category management
- User profile management
- Borrowing records and tracking

## Requirements

- Node.js 16+
- PostgreSQL database
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

3. Create a `.env` file at the repository root with your database URL:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/librarydb"
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

### Users
- `GET /users` — get all users
- `GET /users/:id` — get user by ID
- `POST /users` — create a user
- `PUT /users/:id` — update user
- `DELETE /users/:id` — delete user

### Books
- `GET /books` — get all books
- `GET /books/:id` — get a book by ID
- `POST /books` — create a book
- `PUT /books/:id` — update a book
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
- `POST /profiles` — create a profile
- `PUT /profiles/:id` — update a profile
- `DELETE /profiles/:id` — delete a profile

### Borrowings
- `GET /borrowings` — get all borrowings
- `GET /borrowings/:id` — get a borrowing by ID
- `POST /borrowings` — create a borrowing record
- `PUT /borrowings/:id` — update a borrowing record
- `DELETE /borrowings/:id` — delete a borrowing record

## Authentication

- Protect routes with JWT.
- Send tokens using the header:
  ```http
  Authorization: Bearer <token>
  ```
- Admin-only routes include user, profile, borrowing, and category management actions.

## Project Structure

```
libraryapi/
├── configs/           # configuration files
├── controllers/       # request handlers
├── generated/         # generated Prisma client
├── middlewares/       # auth and authorization middleware
├── prisma/            # schema, migrations, and seed script
├── routes/            # route definitions
├── validations/       # request validation logic
├── index.js           # application entry point
├── package.json       # dependencies and scripts
├── prisma.config.js   # Prisma config
└── README.md          # project documentation
```

## Notes

- Server listens on `http://localhost:3000`
- Most endpoints require authentication
- Use the `/auth` routes to obtain a valid JWT before calling protected routes
