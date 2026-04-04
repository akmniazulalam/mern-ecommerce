const express = require("express");
const {
  signupController,
  getAllUsers,
  deleteUser,
  loginController,
  logoutController,
  dashboardController,
  otpController,
  resendOtpController,
} = require("./auth.controller");
const authMiddleware = require("./auth.middleware");
const router = express.Router();

router.post("/signup", signupController);
router.post("/otpverify", otpController);
router.post("/resendotp", resendOtpController);
router.get("/userlist", getAllUsers);
router.delete("/deleteuser/:id", deleteUser);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/dashboard", authMiddleware, dashboardController);

module.exports = router;
