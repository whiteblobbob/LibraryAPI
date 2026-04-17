import prisma from "../configs/database.config.js"

export const getBooks = async (req, res) => {
  const books = await prisma.books.findMany()
  res.send(books)
}

export const getBookById = async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.send("Missing or invalid parameter(s)")
    }

    const book = await prisma.books.findUnique({ where: { id } })

    if (!book) {
      return res.send("Book not found")
    }

    res.send(book)
}

export const createBook = async (req, res) => {
  const categoryId = parseInt(req.body.categoryId)
  const { title, author, year } = req.body

  if (!(title && author && year) || isNaN(categoryId)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const category = await prisma.categories.findUnique({ where: { id: categoryId } })

  if (!category) {
    return res.send("Category not found")
  }

  await prisma.books.create({ data: {
    title,
    author,
    year,
    category: {
      connect: { id: categoryId }
    }
  }})

  res.send("Success")
}

export const updateBook = async (req, res) => {
  const id = parseInt(req.params.id)
  const categoryId = parseInt(req.body.categoryId)

  const { title, author, year } = req.body

  if (!(title && author && year) || isNaN(id) || isNaN(categoryId)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const book = await prisma.books.findUnique({ where: { id } })

  if (!book) {
    return res.send("Book not found")
  }

  const category = await prisma.categories.findUnique({ where: { id: categoryId } })

  if (!category) {
    return res.send("Category not found")
  }

  await prisma.books.update({
    where: { id },
    data: {
      id,
      title,
      author,
      year,
      category: {
        connect: { id: categoryId }
      }
    }
  })

  res.send("Success")
}

export const deleteBook = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const book = await prisma.books.findUnique({ where: { id } })

  if (!book) {
    return res.send("Book not found")
  }

  await prisma.books.delete({ where: { id } })

  res.send("Success")
}