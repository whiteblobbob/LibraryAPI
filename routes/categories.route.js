import express from 'express'
import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryByIdWithBooks, updateCategory } from '../controllers/categories.controller.js'

const router = express.Router()

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.get('/:id/books', getCategoryByIdWithBooks)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export { router as categoriesRouter }