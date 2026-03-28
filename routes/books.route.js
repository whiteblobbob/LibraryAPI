import express from 'express'
import prisma from '../configs/database.config.js'
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/books.controller.js'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)
router.post('/', createBook)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

export {router as booksRouter};