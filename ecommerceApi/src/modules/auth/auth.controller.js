const jwt = require("jsonwebtoken");
const userSchema = require('./auth.model')
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const passVal = require("../../common/utils/passVal");
const emailValidation = require("../../common/utils/emailValidation");
const emailVerification = require("../../common/utils/emailVerification");
const uploadImage = require("../../common/config/cloudinary");

async function signupController(req, res) {
  const { firstName, lastName, email, password } = req.body;
  const token = jwt.sign({ id: email }, "niaz");
  if (!firstName || !lastName) {
    return res.status(400).json({
      message: "Error: First name and last name are required",
    });
  }
  if (!email) {
    return res.status(400).json({
      message: "Error: Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Error: Password is required",
    });
  }
  if (!emailValidation(email)) {
    return res.status(400).json({
      message: "Error: Email format is not correct.",
    });
  }

  if (!passVal(password)) {
    return res.status(400).json({
      message: "Error: Password format is not correct.",
    });
  }

  const existingEmail = await userSchema.find({ email });

  console.log(existingEmail.length);

  if (existingEmail.length > 0) {
    return res.status(409).json({
      message: "This email already used",
    });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  console.log(otp);

  const expireOtp = new Date(Date.now() + 10 * 60 * 1000);
  console.log(expireOtp);

  bcrypt.hash(password, 10, async (err, hash) => {
    const user = new userSchema({
      firstName,
      lastName,
      email,
      password: hash,
      token: token,
      otp,
      expireOtp,
    });
    await user.save();
    
    emailVerification(email, otp);
  });
  res.json({
    message: "Data send",
  });
}

async function getAllUsers(req, res) {
  const getAllUsers = await userSchema.find({});
  res.status(200).json({
    message: "Get all users",
    data: getAllUsers,
  });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  const deleteUser = await userSchema.findByIdAndDelete(id);
  res.status(200).json({
    message: "Deleted successfully done",
    data: deleteUser,
  });
}

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
    return res.status(400).json({ error: "Email not found" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expireOtp = new Date(Date.now() + 10 * 60 * 1000);

  resendOtpUser.otp = otp;
  resendOtpUser.expireOtp = expireOtp;

  emailVerification(email, otp);

  await resendOtpUser.save();

  res.status(200).json({
    message: "Resend Otp send successfully",
  });

  // return res.json({message: "Resend Otp Email"})
}

async function loginController(req, res) {
  const { email, password } = req.body;

  const existingEmailUser = await userSchema.findOne({ email });

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  if (!emailValidation(email)) {
    return res.status(400).json({
      message: "Email format is not correct",
    });
  }
  if (!existingEmailUser) {
    return res.status(400).json({
      message: "Email not found",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  if (!existingEmailUser.isVerified) {
    return res.status(403).json({
      message: "User is not verified",
    });
  } else {
    bcrypt.compare(password, existingEmailUser.password, (err, result) => {
      if (!result) {
        return res.status(401).json({ message: "Password is not matched" });
      }
      req.session.isAuth = true;
      req.session.user = {
        id: existingEmailUser.id,
        email: existingEmailUser.email,
        firstName: existingEmailUser.firstName,
        lastName: existingEmailUser.lastName
      };
      return res.status(200).json({ message: "Login Successful" });
    });

    // const isMatch = await bcrypt.compare(password, existingEmailUser.password)

    // if (!isMatch) {
    //     return res.json({ message: "Invalid Password" })
    // }

    //    res.json({
    //     message: "Login Successful"
    //    })
  }
}
function dashboardController(req, res) {
  return res.status(200).json({
    message: "Welcome to Dashboard",
  });
}

async function currentuserController(req, res) {
  
  if(!req.session.user){
    return res.status(401).json({
      success: false,
      message: "No user"
    })
  }

  const user = await userSchema.findOne({email: req.session.user.email})

  res.status(200).json({
    success: true,
    user: user
  })
}


function logoutController(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      return res.status(400).json({ message: "Wrong" });
    } else {
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout Successful" });
    }
  });
}

async function uploadAvatarController(req, res) {
  try {
    const userEmail = req.session.user.email;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const imagePath = req.file.path;

    // Upload to Cloudinary
    const result = await uploadImage(imagePath);

    // Save URL in DB
    const user = await userSchema.findOneAndUpdate(
      { email: userEmail },
      { profileImage: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
}

module.exports = {
  loginController,
  logoutController,
  dashboardController,
  otpController,
  resendOtpController,
  signupController,
  getAllUsers,
  deleteUser,
  currentuserController,
  uploadAvatarController
};
