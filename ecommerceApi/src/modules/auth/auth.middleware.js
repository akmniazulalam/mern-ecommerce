
function normalizeRole(role) {
  return String(role || "user").trim().toLowerCase();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getPrimaryAdminEmail() {
  return normalizeEmail(process.env.PRIMARY_ADMIN_EMAIL);
}

function isPrimaryAdminEmail(email) {
  const primaryAdminEmail = getPrimaryAdminEmail();

  return primaryAdminEmail !== "" && normalizeEmail(email) === primaryAdminEmail;
}

function getEffectiveRole(user) {
  if (isPrimaryAdminEmail(user?.email)) {
    return "admin";
  }

  return normalizeRole(user?.role);
}

function authMiddleware(req, res, next) {
  if (req.session?.user) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized access" });
}

function adminMiddleware(req, res, next) {
  if (getEffectiveRole(req.session?.user) === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
}

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
module.exports.getEffectiveRole = getEffectiveRole;
module.exports.getPrimaryAdminEmail = getPrimaryAdminEmail;
module.exports.isPrimaryAdminEmail = isPrimaryAdminEmail;
module.exports.normalizeEmail = normalizeEmail;
module.exports.normalizeRole = normalizeRole;
