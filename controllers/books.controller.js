import { validationResult } from "express-validator"
import prisma from "../configs/database.config.js"

export const getBooks = async (req, res) => {
  const books = await prisma.books.findMany()
  return res.status(200).json(books)
}

export const getBookById = async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const book = await prisma.books.findUnique({ where: { id } })

    if (!book) {
      return res.status(404).json("Book not found")
    }

    res.status(200).json(book)
}

export const createBook = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array())
  }

  const categoryId = parseInt(req.body.categoryId)
  const { title, author, year } = req.body

  const category = await prisma.categories.findUnique({ where: { id: categoryId } })

  if (!category) {
    return res.status(404).json("Category not found")
  }

  await prisma.books.create({ data: {
    title,
    author,
    year,
    category: {
      connect: { id: categoryId }
    }
  }})

  res.status(201).json("Success")
}

export const updateBook = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array())
  }

  const id = parseInt(req.params.id)
  const categoryId = parseInt(req.body.categoryId)
  
  const { title, author, year } = req.body

  const book = await prisma.books.findUnique({ where: { id } })

  if (!book) {
    return res.status(404).json("Book not found")
  }

  const category = await prisma.categories.findUnique({ where: { id: categoryId } })

  if (!category) {
    return res.status(404).json("Category not found")
  }

  await prisma.books.update({
    where: { id },
    data: {
      id,
      title,
      author,
      year,
      category: {
        connect: { id: categoryId }
      }
    }
  })

  return res.status(404).json("Success")
}

export const deleteBook = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const book = await prisma.books.findUnique({ where: { id } })

  if (!book) {
    return res.status(404).json("Book not found")
  }

  await prisma.books.delete({ where: { id } })

  return res.status(200).json("Success")
}