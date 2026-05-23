import prisma from "../configs/database.config.js"
import logger from "../configs/logger.config.js"

export const getProfiles = async (req, res) => {
  try {
    logger.debug('getProfiles: Started')
    const profiles = await prisma.profiles.findMany()
    logger.info('Retrieved profiles from database')
    return res.status(200).json(profiles)
  } catch (error) {
    logger.error('Failed to retrieve profiles', { error })
    return res.status(500).json("An error has occurred while retrieving profiles")
  }
}

export const getProfileById = async (req, res) => {
  try {
    logger.debug('getProfileById: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid profile ID', { id: req.params.id })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const profile = await prisma.profiles.findUnique({ where: { id } })

    if (!profile) {
      logger.warn('Profile not found', { id })
      return res.status(404).json("Profile not found")
    }

    logger.info('Profile retrieved successfully', { id })
    return res.status(200).json(profile)
  } catch (error) {
    logger.error('Failed to retrieve profile', { error })
    return res.status(500).json("An error has occurred while retrieving profile")
  }
}

export const createProfile = async (req, res) => {
  try {
    logger.debug('createProfile: Started')
    const userId = parseInt(req.body.userId)
    const { address, phone } = req.body

    if (isNaN(userId)) {
      logger.warn('Invalid user ID', { userId: req.body.userId })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      logger.warn('User not found for profile creation', { userId })
      return res.status(404).json("User not found")
    }

    const result = await prisma.profiles.create({
      data: {
        address,
        phone,
        user: { connect: { id: userId } }
      }
    })

    logger.info('Profile created successfully', { profileId: result.id, userId })
    return res.status(201).json("Success")
  } catch (error) {
    logger.error('Failed to create profile', { error })
    return res.status(500).json("An error has occurred while creating profile")
  }
}

export const updateProfile = async (req, res) => {
  try {
    logger.debug('updateProfile: Started')
    const id = parseInt(req.params.id)
    const { address, phone } = req.body

    if (isNaN(id)) {
      logger.warn('Invalid profile ID', { id: req.params.id })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const profile = await prisma.profiles.findUnique({ where: { id } })

    if (!profile) {
      logger.warn('Profile not found', { id })
      return res.status(404).json("Profile not found")
    }

    await prisma.profiles.update({
      where: { id },
      data: { address, phone }
    })

    logger.info('Profile updated successfully', { id })
    return res.status(200).json("Success")
  } catch (error) {
    logger.error('Failed to update profile', { error })
    return res.status(500).json("An error has occurred while updating profile")
  }
}

export const deleteProfile = async (req, res) => {
  try {
    logger.debug('deleteProfile: Started')
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      logger.warn('Invalid profile ID', { id: req.params.id })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const profile = await prisma.profiles.findUnique({ where: { id } })

    if (!profile) {
      logger.warn('Profile not found', { id })
      return res.status(404).json("Profile not found")
    }

    await prisma.profiles.delete({ where: { id } })

    logger.info('Profile deleted successfully', { id })
    return res.status(200).json("Success")
  } catch (error) {
    logger.error('Failed to delete profile', { error })
    return res.status(500).json("An error has occurred while deleting profile")
  }
}
