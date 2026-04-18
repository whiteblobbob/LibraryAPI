import prisma from "../configs/database.config.js"

const isUserExists = async (userId) => {
  const user = await prisma.users.findUnique({ where: { id: userId } })
  return user
}

const isBookExists = async (bookId) => {
  const book = await prisma.books.findUnique({ where: { id: bookId } })
  return book
}

const isBorrowingExists = async (borrowingId) => {
  const borrowing = await prisma.borrowings.findUnique({ where: { id: borrowingId } })
  return borrowing
}

export const getBorrowings = async (req, res) => {
  const borrowings = await prisma.borrowings.findMany({
    include: {
      borrower: {
        select: { id: true, name: true, email: true }
      },
      book: true
    }
  })

  return res.send(borrowings)
}

export const getBorrowingById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const borrowing = await prisma.borrowings.findUnique({
    where: { id },
    include: {
      borrower: {
        select: { id: true, name: true, email: true }
      },
      book: true
    }
  })

  if (!borrowing) {
    return res.send("Borrowing not found")
  }

  return res.send(borrowing)
}

export const createBorrowing = async (req, res) => {
  const userId = parseInt(req.body.userId)
  const bookId = parseInt(req.body.bookId)

  if (isNaN(userId) || isNaN(bookId)) {
    return res.send("Missing or invalid parameter(s)")
  }

  if (!(await isUserExists(userId))) {
    return res.send("User not found")
  }

  if (!(await isBookExists(bookId))) {
    return res.send("Book not found")
  }

  await prisma.borrowings.create({
    data: {
      borrower: {
        connect: { id: userId }
      },
      book: {
        connect: { id: bookId }
      }
    }
  })

  await prisma.books.update({
    where: { id: bookId },
    data: { available: false }
  })

  return res.send("Success")
}

export const updateBorrowing = async (req, res) => {
  // TODO
}

export const returnBook = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.send("Missing or invalid parameter(s)")
  }

  const borrowing = await prisma.borrowings.findUnique({
    where: { id }
  })

  if (!borrowing) {
    return res.send("Borrowing not found")
  }

  if (borrowing.returnedAt) {
    return res.send("Book already returned")
  }

  await prisma.borrowings.update({
    where: { id },
    data: { returnedAt: new Date() }
  })

  await prisma.books.update({
    where: { id: borrowing.bookId },
    data: { available: true }
  })

  return res.send("Success")
}

export const deleteBorrowing = async (req, res) => {
  const id = parseInt(req.params.id)

  const borrowing = await prisma.borrowings.findUnique({
    where: { id }
  })

  if (!borrowing) {
    return res.send("Borrowing not found")
  }

  await prisma.borrowings.delete({
    where: { id }
  })

  await prisma.books.update({
    where: { id: borrowing.bookId },
    data: { available: true }
  })

  return res.send("Success")
}