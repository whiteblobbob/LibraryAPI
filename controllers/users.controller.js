import bcrypt from 'bcrypt'
import prisma from "../configs/database.config.js"
import { validationResult } from "express-validator"
import logger from "../configs/logger.config.js"
import 'dotenv/config'

export const getUsers = async (req, res) => {
  try {
    logger.debug('getUsers: Started')
    const users = await prisma.users.findMany()
    logger.info('Retrieved users from database')
    return res.status(200).json({ success: true, data: users })
  } catch (error) {
    logger.error('Failed to retrieve users', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while retrieving users" })
  }
}

export const getUserById = async (req, res) => {
  try {
    logger.debug('getUserById: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid user ID', { id: req.params.id })
      return res.status(400).json({ success: false, message: "Missing or invalid parameter(s)" })
    }

    const user = await prisma.users.findUnique({ where: { id } })

    if (!user) {
      logger.warn('User not found', { id })
      return res.status(404).json({ success: false, message: "User not found" })
    }

    logger.info('User retrieved successfully', { id })
    return res.status(200).json({ success: true, data: user })
  } catch (error) {
    logger.error('Failed to retrieve user', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while retrieving user" })
  }
}

export const getUserByIdWithProfile = async (req, res) => {
  try {
    logger.debug('getUserByIdWithProfile: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid user ID', { id: req.params.id })
      return res.status(400).json({ success: false, message: "Missing or invalid parameter(s)" })
    }

    const user = await prisma.users.findUnique({
      where: { id },
      include: { profile: true }
    })

    if (!user) {
      logger.warn('User not found', { id })
      return res.status(404).json({ success: false, message: "User not found" })
    }

    logger.info('User with profile retrieved successfully', { id })
    return res.status(200).json({ success: true, data: user })
  } catch (error) {
    logger.error('Failed to retrieve user with profile', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while retrieving user with profile" })
  }
}

export const createUser = async (req, res) => {
  try {
    logger.debug('createUser: Started')
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json({ success: false, errors: validationErrors.array() })
    }

    const { name, email, password, role } = req.body

    const result = await prisma.users.create({ data: {
      name,
      email,
      role,
      password: bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS))
    }})

    logger.info('User created successfully', { id: result.id })
    return res.status(201).json({ success: true, message: "Success" })
  } catch (error) {
    logger.error('Failed to create user', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while creating user" })
  }
}

export const updateUser = async (req, res) => {
  try {
    logger.debug('updateUser: Started')
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json({ success: false, errors: validationErrors.array() })
    }

    const id = parseInt(req.params.id)
    const { name, email, password, role } = req.body

    const user = await prisma.users.findUnique({ where: { id } })

    if (!user) {
      logger.warn('User not found', { id })
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const updateData = {
      name,
      email,
      role
    }

    if (password) {
      updateData.password = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS))
    }

    await prisma.users.update({
      where: { id },
      data: updateData
    })

    logger.info('User updated successfully', { id })
    return res.status(200).json({ success: true, message: "Success" })
  } catch (error) {
    logger.error('Failed to update user', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while updating user" })
  }
}

export const deleteUser = async (req, res) => {
  try {
    logger.debug('deleteUser: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid user ID', { id: req.params.id })
      return res.status(400).json({ success: false, message: "Missing or invalid parameter(s)" })
    }

    const user = await prisma.users.findUnique({ where: { id } })

    if (!user) {
      logger.warn('User not found', { id })
      return res.status(404).json({ success: false, message: "User not found" })
    }

    await prisma.users.delete({ where: { id } })

    logger.info('User deleted successfully', { id })
    return res.status(200).json({ success: true, message: "Success" })
  } catch (error) {
    logger.error('Failed to delete user', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while deleting user" })
  }
}
