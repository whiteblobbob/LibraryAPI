import express from 'express'
import prisma from '../configs/database.config.js'
import { createBook, deleteBook, getBookById, getBooks, getReviews, searchBooks, updateBook } from '../controllers/books.controller.js'
import { bookValidation, updateBookValidation } from '../validations/books.validation.js'
import { authorizeAdmin } from '../middlewares/admin.middleware.js'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

router.get('/', getBooks)
router.get('/search', searchBooks)
router.get('/:id', getBookById)
router.get('/:id/reviews', getReviews)
router.post('/', authorizeAdmin, upload.single('cover'), bookValidation, createBook)
router.put('/:id', authorizeAdmin, upload.single('cover'), updateBookValidation, updateBook)
router.delete('/:id', authorizeAdmin, deleteBook)

export {router as booksRouter};