import { validationResult } from "express-validator"
import prisma from "../configs/database.config.js"

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
  const borrowings = await prisma.borrowings.findMany({
    include: {
      borrower: {
        select: { id: true, name: true, email: true }
      },
      book: true
    }
  })

  return res.status(200).json(borrowings)
}

export const getBorrowingById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(200).json("Missing or invalid parameter(s)")
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
    return res.status(404).json("Borrowing not found")
  }

  return res.status(200).json(borrowing)
}

export const createBorrowing = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array())
  }

  const userId = parseInt(req.body.userId)
  const bookId = parseInt(req.body.bookId)

  if (!(await isUserExists(userId))) {
    return res.status(404).json("User not found")
  }

  if (!(await isBookExists(bookId))) {
    return res.status(404).json("Book not found")
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

  return res.status(201).json("Success")
}

export const updateBorrowing = async (req, res) => {
  // TODO
}

export const returnBook = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const borrowing = await prisma.borrowings.findUnique({
    where: { id }
  })

  if (!borrowing) {
    return res.status(404).json("Borrowing not found")
  }

  if (borrowing.returnedAt) {
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

  return res.status(200).json("Success")
}

export const deleteBorrowing = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const borrowing = await prisma.borrowings.findUnique({
    where: { id }
  })

  if (!borrowing) {
    return res.status(404).json("Borrowing not found")
  }

  await prisma.borrowings.delete({
    where: { id }
  })

  await prisma.books.update({
    where: { id: borrowing.bookId },
    data: { available: true }
  })

  return res.status(200).json("Success")
}