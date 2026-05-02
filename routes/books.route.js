import express from 'express'
import prisma from '../configs/database.config.js'
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/books.controller.js'
import { bookValidation, updateBookValidation } from '../validations/books.validation.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)
router.post('/', bookValidation, createBook)
router.put('/:id', updateBookValidation, updateBook)
router.delete('/:id', deleteBook)

export {router as booksRouter};