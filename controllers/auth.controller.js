import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import prisma from '../configs/database.config.js'
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array())
  }

  const { name, email, password } = req.body

  // row count
  const count = await prisma.users.count({ where: { email } })

  if (count > 0) {
    return res.status(409).json("Email already in use")
  }

  const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS))

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
    select: {
      name: true,
      id: true,
      email: true,
      createdAt: true,
      role: true
    }
  })

  return res.status(201).json(user)
}

export const login = async (req, res) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array())
  }

  const { email, password } = req.body
  const user = await prisma.users.findUnique({ where: { email } })

  if (!(user && bcrypt.compareSync(password, user.password))) {
    return res.status(401).json("Invalid credentials")
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  // delete field from object
  delete user.password

  return res.status(200).json({ user, token })
}