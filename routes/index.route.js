import express from 'express'
import { booksRouter } from './books.route.js'
import { usersRouter } from './users.route.js'
import { profilesRouter } from './profiles.route.js'
import { categoriesRouter } from './categories.route.js'
import { borrowingsRouter } from './borrowings.route.js'
import { authRouter } from './auth.route.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { authorizeAdmin } from '../middlewares/admin.middleware.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send("LibraryAPI is running")
})

router.use('/users', authenticateToken, authorizeAdmin, usersRouter)
router.use('/books', authenticateToken, booksRouter)
router.use('/profiles', authenticateToken, authorizeAdmin, profilesRouter)
router.use('/categories', authenticateToken, categoriesRouter)
router.use('/borrowings', authenticateToken, authorizeAdmin, borrowingsRouter)
router.use('/auth', authRouter)

export default router