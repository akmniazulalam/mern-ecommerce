
function normalizeRole(role) {
  return String(role || "user").trim().toLowerCase();
}

function authMiddleware(req, res, next) {
  if (req.session?.user) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized access" });
}

function adminMiddleware(req, res, next) {
  if (normalizeRole(req.session?.user?.role) === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
}

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
module.exports.normalizeRole = normalizeRole;
