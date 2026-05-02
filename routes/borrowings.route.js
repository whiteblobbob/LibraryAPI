import express from 'express'
import { createBorrowing, deleteBorrowing, getBorrowingById, getBorrowings, returnBook } from '../controllers/borrowings.controller.js'
import { borrowingValidation } from '../validations/borrowings.validation.js'

const router = express.Router()

router.get("/", getBorrowings)
router.get("/:id", getBorrowingById)
router.post("/", borrowingValidation, createBorrowing)
router.put("/:id/return", returnBook)
router.delete("/:id", deleteBorrowing)

export { router as borrowingsRouter }