const express = require('express')
const signupController = require('../../controllers/signupControllers')
const {otpController, resendOtpController} = require('../../controllers/otpController')
const {loginController, logoutController, dashboardController} = require('../../controllers/loginController')
const authMiddleware = require('../../middlewares/authMiddleware')
const router = express.Router()

router.post('/signup', signupController)
router.post('/otpverify', otpController)
router.post('/resendotp', resendOtpController)
router.post('/login', loginController)
router.post('/logout', logoutController)
router.get('/dashboard', authMiddleware, dashboardController)


module.exports = router