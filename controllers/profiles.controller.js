import { validationResult } from "express-validator"
import prisma from "../configs/database.config.js"
import logger from "../configs/logger.config.js"
import { deleteFile, getFileUrl, uploadFile } from "./cloudinary.controller.js"

export const getProfiles = async (req, res) => {
  try {
    logger.debug('getProfiles: Started')

    const profiles = await prisma.profiles.findMany()
    logger.info('Retrieved profiles from database')

    profiles.forEach(profile => {
      if (profile.cloudinaryId) {
        const avatarUrl = getFileUrl(profile.cloudinaryId)
        profile.avatarUrl = avatarUrl
      } else {
        profile.avatarUrl = null
      }
    })
    logger.debug('Generated avatar URLs for all profiles')
    
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

    if (profile.cloudinaryId) {
      const avatarUrl = getFileUrl(profile.cloudinaryId)
      profile.avatarUrl = avatarUrl
    } else {
      profile.avatarUrl = null
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

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

    const userId = parseInt(req.body.userId)
    const { address, phone } = req.body

    if (isNaN(userId)) {
      logger.warn('Invalid user ID', { userId: req.body.userId })
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const userCount = await prisma.users.count({
      where: { id: userId }
    })

    if (userCount < 1) {
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

export const addAvatar = async (req, res) => {
  try {
    logger.debug('addAvatar: Started')

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

    const id = parseInt(req.params.id)


    if (isNaN(id)) {
      logger.warn({ profileId: id }, 'Invalid profile ID')
      return res.status(400).json("Missing or invalid parameter(s)")
    }

    const profile = await prisma.profiles.findUnique({ where: { id } })

    if (!profile) {
      logger.warn({ profileId: id }, 'Profile not found')
      return res.status(404).json('Proifle not found')
    }

    // delete old avatar if exists
    if (profile.cloudinaryId) {
      logger.debug({ cloudinaryId: profile.cloudinaryId }, 'Deleting old avatar')
      await deleteFile(profile.cloudinaryId)
    }

    const avatar = req.file

    logger.debug({ filename: avatar.filename }, 'Uploading avatar to cloudinary')

    const result = await uploadFile(avatar)
    const cloudinaryId = result.public_id

    logger.info({ cloudinaryId }, 'Uploaded avatar to cloudinary successfully')

    await prisma.profiles.update({
      where: { id },
      data: { cloudinaryId }
    })

    logger.info({ profileId: id, cloudinaryId }, 'Added an avatar successfully')
    return res.status(200).json('Success')
    return 
  } catch (error) {
    logger.error({ error }, 'Failed to add an avatar')
    return res.status(500).json("An error has occurred while adding an avatar")
  }
}

export const updateProfile = async (req, res) => {
  try {
    logger.debug('updateProfile: Started')

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      logger.warn('Validation failed', { errors: validationErrors.array() })
      return res.status(400).json(validationErrors.array())
    }

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
