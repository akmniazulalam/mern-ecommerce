const express = require("express");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Rate limiters for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts from this IP, please try again after 15 minutes",
  },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 OTP requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many OTP attempts from this IP, please try again after 15 minutes",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

const handleAvatarUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message || "Invalid file upload" });
    }
    next();
  });
};

const {
  signupController,
  getAllUsers,
  deleteUser,
  loginController,
  logoutController,
  dashboardController,
  otpController,
  resendOtpController,
  currentuserController,
  uploadAvatarController,
} = require("./auth.controller");
const authMiddleware = require("./auth.middleware");
const { adminMiddleware } = require("./auth.middleware");
const { validateObjectIdParam } = require("../../common/middleware/requestValidation");
const {
  validateAvatarUpload,
  validateLoginRequest,
  validateOtpRequest,
  validateResendOtpRequest,
  validateSignupRequest,
} = require("./auth.validators");
const router = express.Router();

router.post("/signup", authLimiter, validateSignupRequest, signupController);
router.post("/otpverify", otpLimiter, validateOtpRequest, otpController);
router.post("/resendotp", otpLimiter, validateResendOtpRequest, resendOtpController);
router.get("/userlist", authMiddleware, adminMiddleware, getAllUsers);
router.delete(
  "/deleteuser/:id",
  authMiddleware,
  adminMiddleware,
  validateObjectIdParam("id", "user id"),
  deleteUser,
);
router.post("/login", authLimiter, validateLoginRequest, loginController);
router.get("/currentuser", currentuserController);
router.post("/logout", logoutController);
router.get("/dashboard", authMiddleware, adminMiddleware, dashboardController);
router.post(
  "/upload-avatar",
  authMiddleware,
  handleAvatarUpload,
  validateAvatarUpload,
  uploadAvatarController,
);

module.exports = router;
