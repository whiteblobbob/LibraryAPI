import { validationResult } from "express-validator"
import logger from "../configs/logger.config.js"
import prisma from "../configs/database.config.js"

export const createReview = async (req, res) => {
  try {
    logger.debug('createReview: Started')

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })

      return res.status(400).json(validationErrors.array())
    }

    const { rating, comment, userId, bookId } = req.body

    const user = await prisma.users.findUnique({ where: { id: userId } })

    if (!user) {
      logger.warn('User not found', { userId })
      return res.status(404).json('User not found')
    }

    const book = await prisma.books.findUnique({ where: { id: bookId } })

    if (!book) {
      logger.warn('Book not found', { bookId })
      return res.status(404).json('Book not found')
    }

    logger.debug({ rating, comment, userId, bookId }, 'Creating review in database')

    const result = await prisma.reviews.create({ data: {
      rating,
      comment,
      user: {
        connect: { id: userId }
      },
      book: {
        connect: { id: bookId }
      }
    } })

    logger.info('Review created successfully', { reviewId: result.id })
    return res.status(201).json('Success')
  } catch (error) {
    logger.error({ error }, 'Failed to create a review')
    res.status(500).json("An error has occured while creating a review")
  }
}