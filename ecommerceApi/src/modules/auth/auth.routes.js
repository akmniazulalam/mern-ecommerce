const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split(".")[1])
  }
})

const upload = multer({ storage: storage })
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
  uploadAvatarController
} = require("./auth.controller");
const authMiddleware = require("./auth.middleware");
const router = express.Router();

router.post("/signup", signupController);
router.post("/otpverify", otpController);
router.post("/resendotp", resendOtpController);
router.get("/userlist", getAllUsers);
router.delete("/deleteuser/:id", deleteUser);
router.post("/login", loginController);
router.get("/currentuser", currentuserController);
router.post("/logout", logoutController);
router.get("/dashboard", authMiddleware, dashboardController);
router.post("/upload-avatar", upload.single("image"), uploadAvatarController);

module.exports = router;
