
function authMiddleware(req, res, next) {
  if (req.session.isAuth) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized access" });
  }
}

module.exports = authMiddleware;
