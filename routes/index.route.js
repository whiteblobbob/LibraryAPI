import express from 'express'
import { booksRouter } from './books.route.js'
import { usersRouter } from './users.route.js'
import { profilesRouter } from './profiles.route.js'
import { categoriesRouter } from './categories.route.js'
import { borrowingsRouter } from './borrowings.route.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send("LibraryAPI is running")
})

router.use('/users', usersRouter)
router.use('/books', booksRouter)
router.use('/profiles', profilesRouter)
router.use('/categories', categoriesRouter)
router.use('/borrowings', borrowingsRouter)

export default router