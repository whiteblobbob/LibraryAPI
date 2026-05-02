import express from 'express'
import { createUser, deleteUser, getUserById, getUserByIdWithProfile, getUsers, updateUser } from '../controllers/users.controller.js'
import { updateUserValidation, userValidation } from '../validations/users.validation.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.get('/:id/profile', getUserByIdWithProfile)
router.post('/', userValidation, createUser)
router.put('/:id', updateUserValidation, updateUser)
router.delete('/:id', deleteUser)

export { router as usersRouter }