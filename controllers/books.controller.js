import { validationResult } from "express-validator"
import prisma from "../configs/database.config.js"
import { deleteFile, getFileUrl, uploadFile } from "./cloudinary.controller.js"
import logger from "../configs/logger.config.js"

export const getBooks = async (req, res) => {
  try {
    logger.debug('getBooks: Started')

    const books = await prisma.books.findMany()
    logger.info('Retreived books from database')

    books.forEach(book => {
      if (book.cloudinaryId) {
        book.coverUrl = getFileUrl(book.cloudinaryId)
      } else {
        book.coverUrl = null
      }
    })
    logger.debug('Generated cover URLs for all books')

    logger.info('Books retreived successfully')
    return res.status(200).json(books)
  } catch (e) {
    logger('Failed to retreive books', { error: e })
    res.status(500).json("An error has occured while retreiving books")
  }
}

export const getBookById = async (req, res) => {
  try {
    logger.debug('getBookById: Started')

    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const book = await prisma.books.findUnique({ where: { id } })

    if (!book) {
      logger.warn('Book not found', { id })
      return res.status(404).json("Book not found")
    }

    if (book.cloudinaryId) {
      book.coverUrl = getFileUrl(book.cloudinaryId)
    } else {
      book.coverUrl = null
    }

    logger.info('Book retreived successfully', { bookId: id })

    return res.status(200).json(book)
  } catch (error) {
    logger.error('Failed to retreive a book', { error })
    res.status(500).json("An error has occured while retreiving a book")
  }
}

export const getReviews = async (req, res) => {
  try {
    logger.debug('getReviews: Started')

    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const book = await prisma.books.findUnique({
      where: { id },
      include: {
        reviews: { include: {
          user: { omit: { password: true } } 
        } }
      }
    })

    if (!book) {
      logger.warn('Book not found', { id })
      return res.status(404).json("Book not found")
    }

    logger.info('Book retreived successfully', { bookId: id })

    return res.status(200).json(book)
  } catch (error) {
    logger.error('Failed to retreive a book', { error })
    res.status(500).json("An error has occured while retreiving a book")
  }
}

export const searchBooks = async (req, res) => {
  try {
    logger.debug('searchBooks: Started')

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

    let { title, author, page } = req.query
    page = parseInt(page)
    page = (isNaN(page) || page < 1) ? 1 : page

    const books = await prisma.books.findMany({
      where: {
        title: { contains: title, mode: 'insensitive' },
        author: { contains: author, mode: 'insensitive' }
      },
      take: 20,
      skip: 20 * (page - 1)
    });

    logger.debug({ title, author }, 'Filtered books in database')

    books.forEach(book => {
      if (book.cloudinaryId) {
        book.coverUrl = getFileUrl(book.cloudinaryId)
      } else {
        book.coverUrl = null
      }
    })
    logger.debug('Generated cover URLs for all books')

    logger.info('Books retreived successfully')
    return res.status(200).json(books)
  } catch (error) {
    logger.error({ error }, 'Failed to search books')
    res.status(500).json("An error has occured while searching books")
  }
}

export const createBook = async (req, res) => {
  try {
    logger.debug('createBook: Started')
    
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

    const categoryId = parseInt(req.body.categoryId)
    const { title, author, year } = req.body

    const category = await prisma.categories.findUnique({ where: { id: categoryId } })

    if (!category) {
      logger.warn('Category not found', { categoryId })
      return res.status(404).json("Category not found")
    }

    const cover = req.file
    let cloudinaryId = null

    if (cover) {
      logger.debug('Uploading cover to Cloudinary', { filename: cover.filename })

      const result = await uploadFile(cover)
      cloudinaryId = result.public_id

      logger.info('Cover uploaded successfully', { cloudinaryId })
    }

    logger.debug('Creating book in database', { title, author, year, categoryId, cloudinaryId })

    const result = await prisma.books.create({ data: {
      title,
      author,
      year,
      category: {
        connect: { id: categoryId }
      },
      cloudinaryId
    }})

    logger.info('Book created successfully', { bookId: result.id })

    res.status(201).json("Success")
  } catch (error) {
    logger.error('Failed to create a book', { error })
    res.status(500).json("An error has occured while creating a book")
  }
}

export const updateBook = async (req, res) => {
  try {
    logger.debug('updateBook: Started')

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

    const id = parseInt(req.params.id)
    const categoryId = parseInt(req.body.categoryId)
    
    const { title, author, year } = req.body

    const book = await prisma.books.findUnique({ where: { id } })

    if (!book) {
      logger.warn('Book not found', { bookId: id } )
      return res.status(404).json("Book not found")
    }

    const category = await prisma.categories.findUnique({ where: { id: categoryId } })

    if (!category) {
      logger.warn('Category not found', { categoryId })
      return res.status(404).json("Category not found")
    }

    const cover = req.file
    let cloudinaryId = book.cloudinaryId

    if (cover) {
      if (cloudinaryId) {
        logger.debug('Deleting old cover', { cloudinaryId })
        await deleteFile(cloudinaryId)
      }

      logger.debug('Uploading new cover', { filename: cover.filename })

      const result = await uploadFile(cover)
      cloudinaryId = result.public_id

      logger.info('Cover uploaded successfully', { cloudinaryId })
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
        },
        cloudinaryId
      }
    })

    logger.info('Book updated successfully')

    return res.status(404).json("Success")
  } catch (error) {
    logger.error('Failed to update a book', { error })
    res.status(500).json("An error has occured while updating a book")
  }
}

export const deleteBook = async (req, res) => {
  try {
    logger.debug('deleteBook: Started')

    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const book = await prisma.books.findUnique({ where: { id } })

    if (!book) {
      logger.warn('Book not found', { bookId: id })
      return res.status(404).json("Book not found")
    }

    if (book.cloudinaryId) {
      logger.debug('Deleting cover from Cloudinary', { cloudinaryId })
      await deleteFile(book.cloudinaryId)
    }
    await prisma.books.delete({ where: { id } })

    logger.info('Book deleted successfully')
    return res.status(200).json("Success")
  } catch (error) {
    logger.error('Failed to delete a book', { error })
    res.status(500).json("An error has occured while deleting a book")
  }
}