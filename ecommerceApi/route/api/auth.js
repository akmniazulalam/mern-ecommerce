const express = require('express')
const {signupController, getAllUsers, deleteUser} = require('../../controllers/signupControllers')
const {otpController, resendOtpController} = require('../../controllers/otpController')
const {loginController, logoutController, dashboardController} = require('../../controllers/loginController')
const authMiddleware = require('../../middlewares/authMiddleware')
const router = express.Router()

router.post('/signup', signupController)
router.post('/otpverify', otpController)
router.post('/resendotp', resendOtpController)
router.get('/userlist', getAllUsers)
router.delete('/deleteuser/:id', deleteUser)
router.post('/login', loginController)
router.post('/logout', logoutController)
router.get('/dashboard', authMiddleware, dashboardController)


module.exports = router