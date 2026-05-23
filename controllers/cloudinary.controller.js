import cloudinary from "../configs/cloudinary.config.js"
import logger from "../configs/logger.config.js"

export const getFileUrl = (publicId) => {
  return cloudinary.v2.url(publicId)
}

export const uploadFile = async (
  file,
  options = {
    folder: 'libraryapi/books/covers'
  }
) => {
  try {
    const result = await cloudinary.v2.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      options,
    )

    return result
  } catch (error) {
    logger.error('Failed to upload a file', { error })
    throw new Error('Error uploading file')
  }
}

export const deleteFile = async (publicId) => {
  try {
    const result = cloudinary.v2.uploader.destroy(publicId)

    return result
  } catch (error) {
    logger.error('Failed to delete a file', { error })
    throw new Error('Error deleting file')
  }
}