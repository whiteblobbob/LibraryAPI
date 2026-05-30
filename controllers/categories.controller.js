import prisma from "../configs/database.config.js"
import { validationResult } from "express-validator"
import logger from "../configs/logger.config.js"

export const getCategories = async (req, res) => {
  try {
    logger.debug('getCategories: Started')
    const categories = await prisma.categories.findMany()
    logger.info('Retrieved categories from database')
    return res.status(200).json({ success: true, data: categories })
  } catch (error) {
    logger.error('Failed to retrieve categories', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while retrieving categories" })
  }
}

export const getCategoryById = async (req, res) => {
  try {
    logger.debug('getCategoryById: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid category ID', { id: req.params.id })
      return res.status(400).json({ success: false, message: "Missing or invalid parameter(s)" })
    }

    const category = await prisma.categories.findUnique({ where: { id } })

    if (!category) {
      logger.warn('Category not found', { id })
      return res.status(404).json({ success: false, message: "Category not found" })
    }

    logger.info('Category retrieved successfully', { id })
    return res.status(200).json({ success: true, data: category })
  } catch (error) {
    logger.error('Failed to retrieve category', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while retrieving category" })
  }
}

export const getCategoryByIdWithBooks = async (req, res) => {
  try {
    logger.debug('getCategoryByIdWithBooks: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid category ID', { id: req.params.id })
      return res.status(400).json({ success: false, message: "Missing or invalid parameter(s)" })
    }

    const category = await prisma.categories.findUnique({
      where: { id },
      include: { books: true }
    })

    if (!category) {
      logger.warn('Category not found', { id })
      return res.status(404).json({ success: false, message: "Category not found" })
    }

    logger.info('Category with books retrieved successfully', { id })
    return res.status(200).json({ success: true, data: category })
  } catch (error) {
    logger.error('Failed to retrieve category with books', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while retrieving category with books" })
  }
}

export const createCategory = async (req, res) => {
  try {
    logger.debug('createCategory: Started')
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json({ success: false, errors: validationErrors.array() })
    }

    const { name } = req.body

    const result = await prisma.categories.create({
      data: { name }
    })

    logger.info('Category created successfully', { id: result.id })
    return res.status(201).json({ success: true, message: "Success" })
  } catch (error) {
    logger.error('Failed to create category', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while creating category" })
  }
}

export const updateCategory = async (req, res) => {
  try {
    logger.debug('updateCategory: Started')
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json({ success: false, errors: validationErrors.array() })
    }

    const id = parseInt(req.params.id)
    const { name } = req.body

    const category = await prisma.categories.findUnique({ where: { id } })

    if (!category) {
      logger.warn('Category not found', { id })
      return res.status(404).json({ success: false, message: "Category not found" })
    }

    await prisma.categories.update({
      where: { id },
      data: { name }
    })

    logger.info('Category updated successfully', { id })
    return res.status(200).json({ success: true, message: "Success" })
  } catch (error) {
    logger.error('Failed to update category', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while updating category" })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    logger.debug('deleteCategory: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid category ID', { id: req.params.id })
      return res.status(400).json({ success: false, message: "Missing or invalid parameter(s)" })
    }

    const category = await prisma.categories.findUnique({ where: { id } })

    if (!category) {
      logger.warn('Category not found', { id })
      return res.status(404).json({ success: false, message: "Category not found" })
    }

    await prisma.categories.delete({ where: { id } })

    logger.info('Category deleted successfully', { id })
    return res.status(200).json({ success: true, message: "Success" })
  } catch (error) {
    logger.error('Failed to delete category', { error })
    return res.status(500).json({ success: false, message: "An error has occurred while deleting category" })
  }
}
