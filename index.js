import express, { json } from "express";
import prisma from "./database.js";

const PORT = 3000
const app = express()
app.use(json())

// books endpoints
app.get('/', (req, res) => {
    res.send("LibraryAPI is running")
})

app.get('/books', async (req, res) => {
  const books = await prisma.books.findMany()
  res.send(books)
})

app.get('/books/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.send("Missing or invalid parameter(s)")
    }

    const book = await prisma.books.findUnique({ where: { id } })

    if (!book) {
      return res.send("Book not found")
    }

    res.send(book)
})

app.post('/books', async (req, res) => {
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
})

app.put('/books/:id', async (req, res) => {
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
})

app.patch('/books', (req, res) => {
  res.send("/books PATCH endpoint")
})

app.delete('/books/:id', async (req, res) => {
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
})

// users endpoints
app.get('/users', async (req, res) => {
  const users = await prisma.users.findMany()
  res.send(users)
})

app.get('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.send("Missing or invalid parameter(s)")
    }

    const user = await prisma.users.findUnique({ where: { id } })

    if (!user) {
      return res.send("User not found")
    }

    res.send(user)
})

app.post('/users', async (req, res) => {
  const { name, email, password } = req.body

  if (!(name && email && password)) {
    return res.send("Missing or invalid parameter(s)")
  }

  await prisma.users.create({ data: {
    name,
    email,
    password
  }})

  res.send("Success")
})

app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, password } = req.body

  if (!(name && email && password) || isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const user = await prisma.users.findUnique({ where: { id } })

  if (!user) {
    return res.send("User not found")
  }

  await prisma.users.update({
    where: { id },
    data: {
      name,
      email,
      password
    }
  })

  res.send("Success")
})

app.patch('/users', (req, res) => {
  res.send("/users PATCH endpoint")
})

app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const user = await prisma.users.findUnique({ where: { id } })

  if (!user) {
    return res.send("User not found")
  }

  await prisma.users.delete({ where: { id } })

  res.send("Success")
})

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})