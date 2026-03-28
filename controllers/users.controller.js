import bcrypt from 'bcrypt'
import prisma from "../configs/database.config.js"

export const getUsers = async (req, res) => {
  const users = await prisma.users.findMany()
  res.send(users)
}

export const getUserById = async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.send("Missing or invalid parameter(s)")
    }

    const user = await prisma.users.findUnique({ where: { id } })

    if (!user) {
      return res.send("User not found")
    }

    res.send(user)
}

export const createUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!(name && email && password)) {
    return res.send("Missing or invalid parameter(s)")
  }

  await prisma.users.create({ data: {
    name,
    email,
    password: bcrypt.hashSync(password, 10)
  }})

  res.send("Success")
}

export const updateUser = async (req, res) => {
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
}

export const deleteUser = async (req, res) => {
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
}
