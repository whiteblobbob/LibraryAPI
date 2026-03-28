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
  const { title, author, year } = req.body

  if (!(title && author && year)) {
    return res.send("Missing or invalid parameter(s)")
  }

  await prisma.books.create({ data: {
    title,
    author,
    year
  }})

  res.send("Success")
}

export const updateBook = async (req, res) => {
  const id = parseInt(req.params.id)
  const { title, author, year } = req.body

  if (!(title && author && year) || isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const book = await prisma.books.findUnique({ where: { id } })

  if (!book) {
    return res.send("Book not found")
  }

  await prisma.books.update({
    where: { id },
    data: {
      id,
      title,
      author,
      year
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