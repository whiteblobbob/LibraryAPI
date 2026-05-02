import express from 'express'
import { loginValidation, registerValidation } from '../validations/auth.validation.js'
import { login, register } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

export { router as authRouter }