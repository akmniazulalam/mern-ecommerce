const emailValidation = require("../helpers/emailValidation");
const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");

async function loginController(req, res) {
  const { email, password } = req.body;

  const existingEmailUser = await userSchema.findOne({ email });

  if (!email) {
    return res.json({
      message: "Email is required",
    });
  }
  if (!emailValidation(email)) {
    return res.json({
      message: "Email format is not correct",
    });
  }
  if (!existingEmailUser) {
    return res.json({
      message: "Email not found",
    });
  }
  if (!password) {
    return res.json({
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
        return res.json({ message: "Password is not matched" });
      }
      req.session.isAuth = true;
      req.session.userSchema = {
        id: existingEmailUser.id,
        email: existingEmailUser.email,
        firstName: existingEmailUser.firstName,
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

function logoutController(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      return res.json({ message: "Wrong" });
    } else {
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout Successful" });
    }
  });
}

module.exports = { loginController, logoutController, dashboardController };
