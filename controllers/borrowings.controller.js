import { validationResult } from "express-validator"
import prisma from "../configs/database.config.js"
import logger from "../configs/logger.config.js"

const isUserExists = async (userId) => {
  const user = await prisma.users.findUnique({ where: { id: userId } })
  return user
}

const isBookExists = async (bookId) => {
  const book = await prisma.books.findUnique({ where: { id: bookId } })
  return book
}

const isBorrowingExists = async (borrowingId) => {
  const borrowing = await prisma.borrowings.findUnique({ where: { id: borrowingId } })
  return borrowing
}

export const getBorrowings = async (req, res) => {
  try {
    logger.debug('getBorrowings: Started')
    const borrowings = await prisma.borrowings.findMany({
      include: {
        borrower: {
          select: { id: true, name: true, email: true }
        },
        book: true
      }
    })

    logger.info('Retrieved borrowings from database')
    return res.status(200).json(borrowings)
  } catch (error) {
    logger.error('Failed to retrieve borrowings', { error })
    return res.status(500).json("An error has occurred while retrieving borrowings")
  }
}

export const getBorrowingById = async (req, res) => {
  try {
    logger.debug('getBorrowingById: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid borrowing ID', { id: req.params.id })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const borrowing = await prisma.borrowings.findUnique({
      where: { id },
      include: {
        borrower: {
          select: { id: true, name: true, email: true }
        },
        book: true
      }
    })

    if (!borrowing) {
      logger.warn('Borrowing not found', { id })
      return res.status(404).json("Borrowing not found")
    }

    logger.info('Borrowing retrieved successfully', { id })
    return res.status(200).json(borrowing)
  } catch (error) {
    logger.error('Failed to retrieve borrowing', { error })
    return res.status(500).json("An error has occurred while retrieving borrowing")
  }
}

export const createBorrowing = async (req, res) => {
  try {
    logger.debug('createBorrowing: Started')
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

    const userId = parseInt(req.body.userId)
    const bookId = parseInt(req.body.bookId)

    if (!(await isUserExists(userId))) {
      logger.warn('User not found', { userId })
      return res.status(404).json("User not found")
    }

    const book = await isBookExists(bookId)
    if (!book) {
      logger.warn('Book not found', { bookId })
      return res.status(404).json("Book not found")
    }

    if (!book.available) {
      logger.warn('Book not available', { bookId })
      return res.status(409).json("Book is already borrowed")
    }

    await prisma.borrowings.create({
      data: {
        borrower: {
          connect: { id: userId }
        },
        book: {
          connect: { id: bookId }
        }
      }
    })

    await prisma.books.update({
      where: { id: bookId },
      data: { available: false }
    })

    logger.info('Borrowing created successfully', { userId, bookId })
    return res.status(201).json("Success")
  } catch (error) {
    logger.error('Failed to create borrowing', { error })
    return res.status(500).json("An error has occurred while creating borrowing")
  }
}

export const updateBorrowing = async (req, res) => {
  try {
    logger.debug('updateBorrowing: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid borrowing ID', { id: req.params.id })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

    const borrowing = await isBorrowingExists(id)

    if (!borrowing) {
      logger.warn('Borrowing not found', { id })
      return res.status(404).json("Borrowing not found")
    }

    const userId = parseInt(req.body.userId)
    const bookId = parseInt(req.body.bookId)

    if (!(await isUserExists(userId))) {
      logger.warn('User not found', { userId })
      return res.status(404).json("User not found")
    }

    if (!(await isBookExists(bookId))) {
      logger.warn('Book not found', { bookId })
      return res.status(404).json("Book not found")
    }

    if (borrowing.bookId !== bookId) {
      // Revert old book availability
      await prisma.books.update({
        where: { id: borrowing.bookId },
        data: { available: true }
      })

      // Set new book availability
      await prisma.books.update({
        where: { id: bookId },
        data: { available: false }
      })
    }

    await prisma.borrowings.update({
      where: { id },
      data: {
        userId,
        bookId
      }
    })

    logger.info('Borrowing updated successfully', { id })
    return res.status(200).json("Success")
  } catch (error) {
    logger.error('Failed to update borrowing', { error })
    return res.status(500).json("An error has occurred while updating borrowing")
  }
}

export const returnBook = async (req, res) => {
  try {
    logger.debug('returnBook: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid borrowing ID', { id: req.params.id })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const borrowing = await prisma.borrowings.findUnique({
      where: { id }
    })

    if (!borrowing) {
      logger.warn('Borrowing not found', { id })
      return res.status(404).json("Borrowing not found")
    }

    if (borrowing.returnedAt) {
      logger.warn('Book already returned', { id })
      return res.status(409).json("Book already returned")
    }

    await prisma.borrowings.update({
      where: { id },
      data: { returnedAt: new Date() }
    })

    await prisma.books.update({
      where: { id: borrowing.bookId },
      data: { available: true }
    })

    logger.info('Book returned successfully', { id })
    return res.status(200).json("Success")
  } catch (error) {
    logger.error('Failed to return book', { error })
    return res.status(500).json("An error has occurred while returning book")
  }
}

export const deleteBorrowing = async (req, res) => {
  try {
    logger.debug('deleteBorrowing: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid borrowing ID', { id: req.params.id })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const borrowing = await prisma.borrowings.findUnique({
      where: { id }
    })

    if (!borrowing) {
      logger.warn('Borrowing not found', { id })
      return res.status(404).json("Borrowing not found")
    }

    await prisma.borrowings.delete({
      where: { id }
    })

    if (!borrowing.returnedAt) {
      await prisma.books.update({
        where: { id: borrowing.bookId },
        data: { available: true }
      })
    }

    logger.info('Borrowing deleted successfully', { id })
    return res.status(200).json("Success")
  } catch (error) {
    logger.error('Failed to delete borrowing', { error })
    return res.status(500).json("An error has occurred while deleting borrowing")
  }
}
