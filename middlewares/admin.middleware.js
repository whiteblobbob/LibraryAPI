export const authorizeAdmin = (req, res, next) => {
  if (!(req.user && req.user.role == 'ADMIN')) {
    return res.status(403).json("Access denied")
  }

  return next()
}