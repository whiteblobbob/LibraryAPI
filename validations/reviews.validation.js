import { body } from "express-validator";

export const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be in between 1-5")
    .notEmpty()
    .withMessage("Rating is required")
    .toInt(),
  body('comment')
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .notEmpty()
    .withMessage("Rating is required"),
  body('bookId')
    .isInt()
    .withMessage("Book ID must be a number")
    .notEmpty()
    .withMessage("Book ID is required")
    .toInt(),
  body('userId')
    .isInt()
    .withMessage("User ID must be a number")
    .notEmpty()
    .withMessage("User ID is required")
    .toInt(),
]