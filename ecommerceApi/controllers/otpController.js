const userSchema = require("../model/userSchema");
const crypto = require("crypto");

async function otpController(req, res) {
  const { email, otp } = req.body;
  const user = await userSchema.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  if (user.isVerified) {
    return res.json({
      message: "User is verified",
    });
  }

  if (!otp) {
    return res.status(400).json({
      message: "Required Otp",
    });
  }
  if (user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid Otp",
    });
  }

  if (user.expireOtp < Date.now()) {
    return res.status(400).json({
      message: "Expired Otp",
    });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.expireOtp = undefined;
  await user.save();
  res.status(200).json({
    message: "Email Verification Done",
  });
}

async function resendOtpController(req, res) {
  const { email } = req.body;
  const resendOtpUser = await userSchema.findOne({ email });
  if (!resendOtpUser) {
    return res.json({ error: "Email not found" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expireOtp = new Date(Date.now() + 10 * 60 * 1000);

  resendOtpUser.otp = otp;
  resendOtpUser.expireOtp = expireOtp;

  await resendOtpUser.save();

  res.status(200).json({
    message: "Resend Otp send successfully",
  });

  // return res.json({message: "Resend Otp Email"})
}

module.exports = { otpController, resendOtpController };
