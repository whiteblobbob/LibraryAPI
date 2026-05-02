import express from 'express'
import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryByIdWithBooks, updateCategory } from '../controllers/categories.controller.js'
import { categoryValidation, updateCategoryValidation } from '../validations/categories.validation.js'

const router = express.Router()

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.get('/:id/books', getCategoryByIdWithBooks)
router.post('/', categoryValidation, createCategory)
router.put('/:id', updateCategoryValidation, updateCategory)
router.delete('/:id', deleteCategory)

export { router as categoriesRouter }