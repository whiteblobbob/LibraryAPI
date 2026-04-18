# Library API

A RESTful API for managing a library system with user authentication, book management, categories, and user profiles.

## Project Information

- **Name:** LibraryAPI
- **Version:** 1.0.0
- **Description:** Primakara Developers 2026 Intermediate Class Back-End Project
- **Author:** Joshua Kevin Wijaya
- **License:** ISC

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** bcrypt for password hashing
- **Development:** Nodemon for hot-reloading

## Features

- User management with authentication
- Book catalog management
- Category organization for books
- User profiles with contact information
- Borrowing system for books
- Role-based access control (USER role)
- Secure password hashing

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create a new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Profiles
- `GET /profiles` - Get all profiles
- `GET /profiles/:id` - Get profile by ID
- `POST /profiles` - Create a new profile
- `PUT /profiles/:id` - Update profile
- `DELETE /profiles/:id` - Delete profile

### Borrowings
- `GET /borrowings` - Get all borrowings
- `GET /borrowings/:id` - Get borrowing by ID
- `POST /borrowings` - Create a new borrowing
- `PUT /borrowings/:id` - Update borrowing
- `DELETE /borrowings/:id` - Delete borrowing

## Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd libraryapi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/librarydb"
   ```

4. **Setup the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## Running the Project

### Development Mode
```bash
npm run dev
```
The API will start on `http://localhost:3000` (or your configured port)

### Production Mode
```bash
node index.js
```

## Project Structure

```
libraryapi/
├── configs/           # Configuration files
│   └── database.config.js
├── controllers/       # Request handlers
│   ├── books.controller.js
│   ├── borrowings.controller.js
│   ├── categories.controller.js
│   ├── profiles.controller.js
│   └── users.controller.js
├── generated/         # Generated Prisma client
│   └── prisma/
├── prisma/           # Prisma schema and migrations
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── routes/           # API route definitions
│   ├── books.route.js
│   ├── borrowings.route.js
│   ├── categories.route.js
│   ├── index.route.js
│   ├── profiles.route.js
│   └── users.route.js
├── index.js          # Main application entry point
├── package.json      # Project dependencies and scripts
├── prisma.config.js  # Prisma configuration
└── README.md         # Project documentation
├── index.js          # Application entry point
├── package.json      # Project dependencies
└── README.md         # This file
```

## Database Schema

### Users Table
- `id` (Int) - Primary key, auto-increment
- `name` (String) - User's full name
- `email` (String) - Unique email address
- `password` (String) - Hashed password
- `role` (String) - User role (default: "USER")
- `createdAt` (DateTime) - Account creation timestamp

### Books Table
- `id` (Int) - Primary key, auto-increment
- `categoryId` (Int) - Foreign key to Categories
- `title` (String) - Book title
- `author` (String) - Book author
- `year` (Int) - Publication year
- `available` (Boolean) - Availability status (default: true)
- `createdAt` (DateTime) - Record creation timestamp

### Profiles Table
- `id` (Int) - Primary key, auto-increment
- `userId` (Int) - Unique foreign key to Users
- `address` (String, optional) - User's address
- `phone` (String, optional) - User's phone number
- `createdAt` (DateTime) - Record creation timestamp

### Categories Table
- Used for organizing books by category

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get profile by ID
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

## Development Notes

- Password hashing is handled automatically by bcrypt
- All timestamps are automatically managed by the database
- User profiles are optional (one-to-one relationship with users)
- Books must belong to a category

## Contributing

This is a school project for the Primakara Developers 2026 Intermediate Class.

---

**Last Updated:** April 2026
