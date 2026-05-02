import express from 'express'
import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryByIdWithBooks, updateCategory } from '../controllers/categories.controller.js'
import { categoryValidation, updateCategoryValidation } from '../validations/categories.validation.js'
import { authorizeAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.get('/:id/books', getCategoryByIdWithBooks)
router.post('/', authorizeAdmin, categoryValidation, createCategory)
router.put('/:id', authorizeAdmin, updateCategoryValidation, updateCategory)
router.delete('/:id', authorizeAdmin, deleteCategory)

export { router as categoriesRouter }