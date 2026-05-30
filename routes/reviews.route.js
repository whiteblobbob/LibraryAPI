import express from 'express'
import { createReview } from '../controllers/reviews.controller.js'
import { reviewValidation } from '../validations/reviews.validation.js'

const router = express.Router()

router.post('/', reviewValidation, createReview)

export { router as reviewsRouter }