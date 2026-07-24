const userSchema = require("./auth.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const passVal = require("../../common/utils/passVal");
const emailValidation = require("../../common/utils/emailValidation");
const emailVerification = require("../../common/utils/emailVerification");
const uploadImage = require("../../common/config/cloudinary");
const { normalizeRole } = require("./auth.middleware");

const isProduction = process.env.NODE_ENV === "production";
const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

// In-memory track of failed OTP attempts per email
const otpAttemptsMap = new Map();

async function signupController(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

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
    if (existingEmail.length > 0) {
      return res.status(409).json({
        message: "This email already used",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expireOtp = new Date(Date.now() + 10 * 60 * 1000);

    const hash = await bcrypt.hash(password, 10);
    const user = new userSchema({
      firstName,
      lastName,
      email,
      password: hash,
      otp,
      expireOtp,
    });
    await user.save();

    try {
      await emailVerification(email, otp);
    } catch (emailErr) {
      await userSchema.deleteOne({ _id: user._id }).catch(() => {});
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }

    return res.json({
      message: "Data send",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email already used",
      });
    }
    return res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await userSchema
      .find({})
      .select("-password -otp -expireOtp -token");
    res.status(200).json({
      message: "Get all users",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const deletedUser = await userSchema.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Deleted successfully done",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
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

  const currentAttempts = otpAttemptsMap.get(email) || 0;
  if (currentAttempts >= 5) {
    return res.status(429).json({
      message: "Too many failed OTP attempts. Please request a new OTP.",
    });
  }

  if (user.otp !== otp) {
    otpAttemptsMap.set(email, currentAttempts + 1);
    return res.status(400).json({
      message: "Invalid Otp",
    });
  }

  if (user.expireOtp < Date.now()) {
    return res.status(400).json({
      message: "Expired Otp",
    });
  }

  // Clear attempts on success
  otpAttemptsMap.delete(email);

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

  // Reset attempt counter when new OTP is generated
  otpAttemptsMap.delete(email);

  resendOtpUser.otp = otp;
  resendOtpUser.expireOtp = expireOtp;

  await emailVerification(email, otp);
  await resendOtpUser.save();

  res.status(200).json({
    message: "Resend Otp send successfully",
  });
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
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      if (!result) {
        return res.status(401).json({ message: "Password is not matched" });
      }
      const sessionUser = {
        id: existingEmailUser.id,
        email: existingEmailUser.email,
        firstName: existingEmailUser.firstName,
        lastName: existingEmailUser.lastName,
        role: normalizeRole(existingEmailUser.role),
        profileImage: existingEmailUser.profileImage || "",
      };

      req.session.isAuth = true;
      req.session.user = sessionUser;
      req.session.save((saveErr) => {
        if (saveErr) {
          return res.status(500).json({ message: "Login failed" });
        }

        return res
          .status(200)
          .json({ message: "Login Successful", user: sessionUser });
      });
    });
  }
}

function dashboardController(req, res) {
  return res.status(200).json({
    message: "Welcome to Dashboard",
  });
}

async function currentuserController(req, res) {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "No user",
    });
  }

  const user = await userSchema
    .findOne({ email: req.session.user.email })
    .select("-password -otp -expireOtp -token");

  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({
      success: false,
      message: "No user",
    });
  }

  const sessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: normalizeRole(user.role),
    profileImage: user.profileImage || "",
  };

  req.session.user = sessionUser;

  res.status(200).json({
    success: true,
    user: sessionUser,
  });
}

function logoutController(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to log out. Please try again." });
    } else {
      res.clearCookie("ecommerce.sid", sessionCookieOptions);
      res.clearCookie("connect.sid", sessionCookieOptions);
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

    const result = await uploadImage(imagePath);

    const user = await userSchema.findOneAndUpdate(
      { email: userEmail },
      { profileImage: result.secure_url },
      { new: true },
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
  uploadAvatarController,
};
