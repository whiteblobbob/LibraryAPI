import prisma from "../configs/database.config.js"

export const getProfiles = async (req, res) => {
  const profiles = await prisma.profiles.findMany()

  return res.status(200).json(profiles)
}

export const getProfileById = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const profile = await prisma.profiles.findUnique({ where: { id } })

  if (!profile) {
    return res.status(404).json("Profile not found")
  }

  return res.status(200).json(profile)
}

export const createProfile = async (req, res) => {
  const userId = parseInt(req.body.userId)
  const { address, phone } = req.body

  if (isNaN(userId)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const user = await prisma.users.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return res.status(404).json("User not found")
  }

  await prisma.profiles.create({
    data: {
      address,
      phone,
      user: { connect: { id: userId } }
    }
  })

  return res.status(201).json("Success")
}

export const updateProfile = async (req, res) => {
  const id = parseInt(req.params.id)
  const { address, phone } = req.body

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const profile = await prisma.profiles.findUnique({ where: { id } })

  if (!profile) {
    return res.status(404).json("Profile not found")
  }

  await prisma.profiles.update({
    where: { id },
    data: { address, phone }
  })

  return res.status(200).json("Success")
}

export const deleteProfile = async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json("Missing or invalid parameter(s)")
  }

  const profile = await prisma.profiles.findUnique({ where: { id } })

  if (!profile) {
    return res.status(404).json("Profile not found")
  }

  await prisma.profiles.delete({ where: { id } })

  return res.status(200).json("Success")
}