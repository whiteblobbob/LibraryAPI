import bcrypt from 'bcrypt'
import prisma from "../configs/database.config.js"

export const getUsers = async (req, res) => {
  const users = await prisma.users.findMany()
  return res.status(200).json(users)
}

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const user = await prisma.users.findUnique({ where: { id } })

  if (!user) {
    return res.status(404).json("User not found")
  }

  return res.status(200).json(user)
}

export const getUserByIdWithProfile = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const user = await prisma.users.findUnique({
    where: { id },
    include: { profile: true }
  })

  if (!user) {
    return res.status(404).json("User not found")
  }

  return res.status(200).json(user)
}

export const createUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!(name && email && password)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  await prisma.users.create({ data: {
    name,
    email,
    password: bcrypt.hashSync(password, 10)
  }})

  return res.status(201).json("Success")
}

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, password } = req.body

  if (!(name && email && password) || isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const user = await prisma.users.findUnique({ where: { id } })

  if (!user) {
    return res.status(404).json("User not found")
  }

  await prisma.users.update({
    where: { id },
    data: {
      name,
      email,
      password
    }
  })

  return res.status(200).json("Success")
}

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const user = await prisma.users.findUnique({ where: { id } })

  if (!user) {
    return res.status(404).json("User not found")
  }

  await prisma.users.delete({ where: { id } })

  return res.status(200).json("Success")
}
