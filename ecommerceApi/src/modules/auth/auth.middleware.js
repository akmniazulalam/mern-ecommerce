
function normalizeRole(role) {
  return String(role || "user").trim().toLowerCase();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getPrimaryAdminEmail() {
  return normalizeEmail(process.env.PRIMARY_ADMIN_EMAIL);
}

function getDemoAdminEmail() {
  return normalizeEmail(process.env.DEMO_ADMIN_EMAIL);
}

function isPrimaryAdminEmail(email) {
  const primaryAdminEmail = getPrimaryAdminEmail();

  return primaryAdminEmail !== "" && normalizeEmail(email) === primaryAdminEmail;
}

function isDemoAdminEmail(email) {
  const demoAdminEmail = getDemoAdminEmail();

  return demoAdminEmail !== "" && normalizeEmail(email) === demoAdminEmail;
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

function demoReadOnlyMiddleware(req, res, next) {
  const writeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
  const allowedAuthPaths = new Set([
    "/api/v1/auth/login",
    "/api/v1/auth/logout",
  ]);

  if (!writeMethods.has(req.method)) {
    return next();
  }

  if (!isDemoAdminEmail(req.session?.user?.email)) {
    return next();
  }

  if (allowedAuthPaths.has(req.originalUrl)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Demo account is read-only. Changes are disabled.",
  });
}

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
module.exports.demoReadOnlyMiddleware = demoReadOnlyMiddleware;
module.exports.getEffectiveRole = getEffectiveRole;
module.exports.getDemoAdminEmail = getDemoAdminEmail;
module.exports.getPrimaryAdminEmail = getPrimaryAdminEmail;
module.exports.isDemoAdminEmail = isDemoAdminEmail;
module.exports.isPrimaryAdminEmail = isPrimaryAdminEmail;
module.exports.normalizeEmail = normalizeEmail;
module.exports.normalizeRole = normalizeRole;
