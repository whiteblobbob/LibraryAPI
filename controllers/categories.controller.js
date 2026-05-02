import prisma from "../configs/database.config.js"
import { validationResult } from "express-validator"

export const getCategories = async (req, res) => {
  const categories = await prisma.categories.findMany()

  return res.status(200).json(categories)
}

export const getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({ where: { id } })

  if (!category) {
    return res.status(404).json("Category not found")
  }

  return res.status(200).json(category)
}

export const getCategoryByIdWithBooks = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({
    where: { id },
    include: { books: true }
  })

  if (!category) {
    return res.status(404).json("Category not found")
  }

  return res.status(200).json(category)
}

export const createCategory = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array())
  }

  const { name } = req.body

  await prisma.categories.create({
    data: { name }
  })

  return res.status(201).json("Success")
}

export const updateCategory = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array())
  }

  const id = parseInt(req.params.id)
  const { name } = req.body

  const category = await prisma.categories.findUnique({ where: { id } })

  if (!category) {
    return res.status(404).json("Category not found")
  }

  await prisma.categories.update({
    where: { id },
    data: { name }
  })

  return res.status(200).json("Success")
}

export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({ where: { id } })

  if (!category) {
    return res.status(404).json("Category not found")
  }

  await prisma.categories.delete({ where: { id } })

  return res.status(200).json("Success")
}