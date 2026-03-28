import express from 'express'
import { booksRouter } from './books.route.js'
import { usersRouter } from './users.route.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send("LibraryAPI is running")
})

router.use('/users', usersRouter)
router.use('/books', booksRouter)

export default router