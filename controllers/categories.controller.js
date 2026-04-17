import prisma from "../configs/database.config.js"

export const getCategories = async (req, res) => {
  const categories = await prisma.categories.findMany()

  return res.send(categories)
}

export const getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({ where: { id } })

  if (!category) {
    return res.send("Category not found")
  }

  return res.send(category)
}

export const getCategoryByIdWithBooks = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({
    where: { id },
    include: { books: true }
  })

  if (!category) {
    return res.send("Category not found")
  }

  return res.send(category)
}

export const createCategory = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.send("Missing or invalid parameter(s)")
  }

  await prisma.categories.create({
    data: { name }
  })

  return res.send("Success")
}

export const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name } = req.body

  if (!name || isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({ where: { id } })

  if (!category) {
    return res.send("Category not found")
  }

  await prisma.categories.update({
    where: { id },
    data: { name }
  })

  return res.send("Success")
}

export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({ where: { id } })

  if (!category) {
    return res.send("Category not found")
  }

  await prisma.categories.delete({ where: { id } })

  return res.send("Success")
}