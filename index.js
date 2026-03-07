import express, { json } from "express";

const PORT = 3000
const app = express()
app.use(json())

// dummy books data
const books = [
  {
    id: 1,
    title: "Mein Kampf",
    author: "Adolf Hitler",
    year: 1925
  },
  {
    id: 2,
    title: "Mein Kampf",
    author: "Adolf Hitler",
    year: 1925
  }
]

// dummy id increment
let increment = 3

app.get('/', (req, res) => {
    res.send("LibraryAPI is running")
})

app.get('/books', (req, res) => {
    res.send(books)
})

app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.send("Missing or invalid parameter(s)")
    }

    const book = books.find(book => book.id === id)

    if (!book) {
      return res.send("Book not found")
    }

    res.send(book)
})

app.post('/books', (req, res) => {
  const { title, author, year } = req.body

  if (!(title && author && year)) {
    return res.send("Missing or invalid parameter(s)")
  }

  books.push({
    id: increment,
    title,
    author,
    year
  })

  increment++

  res.send("Success")
})

app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { title, author, year } = req.body

  if (!(title && author && year) || isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const index = books.findIndex(book => book.id === id)

  if (index === -1) {
    return res.send("Book not found")
  }

  books[index] = {
    id,
    title,
    author,
    year
  }

  res.send("Success")
})

app.patch('/books', (req, res) => {
  res.send("/books PATCH endpoint")
})

app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const index = books.findIndex(book => book.id === id)

  if (index === -1) {
    return res.send("Book not found")
  }

  books.splice(index, 1)

  res.send("Success")
})

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})