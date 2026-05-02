import { body } from "express-validator";

export const bookValidation = [
  body('title')
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),
  body('author')
    .isString()
    .withMessage("Author must be a string")
    .notEmpty()
    .withMessage("Author is required"),
  body('year')
    .isInt()
    .withMessage("Year must be above 1879")
    .notEmpty()
    .withMessage("Year is required"),
  body('categoryId')
    .isInt()
    .withMessage("Category ID must be a number")
    .notEmpty()
    .withMessage("Category ID is required")
]

export const updateBookValidation = [
  body('title')
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),
  body('author')
    .optional()
    .isString()
    .withMessage("Author must be a string")
    .notEmpty()
    .withMessage("Author is required"),
  body('year')
    .optional()
    .isInt()
    .withMessage("Year must be above 1879")
    .notEmpty()
    .withMessage("Year is required"),
  body('categoryId')
    .optional()
    .isInt()
    .withMessage("Category ID must be a number")
    .notEmpty()
    .withMessage("Category ID is required")
]