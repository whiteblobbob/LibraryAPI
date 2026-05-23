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
    .isInt({ min: 1900 })
    .withMessage("Year must be above 1879")
    .notEmpty()
    .withMessage("Year is required")
    .toInt(),
  body('categoryId')
    .isInt()
    .withMessage("Category ID must be a number")
    .notEmpty()
    .withMessage("Category ID is required")
    .toInt(),
  body('cover').custom((value, { req }) => {
    const cover = req.file

    if (!cover) {
      return true // No file uploaded, so skip validation
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(cover.mimetype)) {
      throw new Error('Cover must be a PNG or JPEG image')
    }

    // Check file size (max 1MB)
    if (cover.size >= 1 * 1024 * 1024) {
      throw new Error('Cover must be less than 1MB')
    }

    return true
  }),
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
    .withMessage("Category ID is required"),
  body('cover').custom((value, { req }) => {
    const cover = req.file

    if (!cover) {
      return true // No file uploaded, so skip validation
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(cover.mimetype)) {
      throw new Error('Cover must be a PNG or JPEG image')
    }

    // Check file size (max 1MB)
    if (cover.size >= 1 * 1024 * 1024) {
      throw new Error('Cover must be less than 1MB')
    }

    return true
  }),
]