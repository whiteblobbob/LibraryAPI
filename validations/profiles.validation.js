import { body } from "express-validator";

export const profileValidation = [
  body('address')
    .optional()
    .isString()
    .withMessage('Address must be a string')
    .notEmpty()
    .withMessage('Address is required'),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .notEmpty()
    .withMessage('Phone is required'),
]

export const avatarValidation = [
  body('avatar').custom((value, { req }) => {
    const cover = req.file

    if (!cover) {
      throw new Error('Missing image')
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