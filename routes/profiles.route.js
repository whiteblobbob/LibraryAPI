import express from 'express'
import { addAvatar, createProfile, deleteProfile, getProfileById, getProfiles, updateProfile } from '../controllers/profiles.controller.js'
import { avatarValidation, profileValidation } from '../validations/profiles.validation.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get('/', getProfiles)
router.get('/:id', getProfileById)
router.post('/', profileValidation, createProfile)
router.post('/:id/avatar', upload.single('avatar'), avatarValidation, addAvatar)
router.put('/:id', updateProfile)
router.delete('/:id', deleteProfile)

export { router as profilesRouter }