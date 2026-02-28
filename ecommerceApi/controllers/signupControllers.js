const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = require("../model/userSchema");
const emailValidation = require("../helpers/emailValidation");
const passVal = require("../helpers/passVal");
const emailVerification = require("../helpers/emailVerification");

async function signupController(req, res) {
  const { firstName, lastName, email, password } = req.body;
  const token = jwt.sign({id: email}, "niaz")
  if(!firstName || !lastName) {
    return res.json({
        message: "Error: First name and last name are required"
    })
  }
  if(!email) {
    return res.json({
        message: "Error: Email is required"
    })
  }
  if(!password) {
    return res.json({
        message: "Error: Password is required"
    })
  }
  if(!emailValidation(email)) {
    return res.json({
        message: "Error: Email format is not correct."
    })
  }

  if(!passVal(password)) {
    return res.json({
      message: "Error: Password format is not correct."
    })
  }

  const existingEmail = await userSchema.find({email})

  console.log(existingEmail.length)

  if(existingEmail.length > 0) {
    return res.json({
      message: "This email already used"
    })
  }

  const otp = crypto.randomInt(100000, 999999).toString()
  console.log(otp)

  const expireOtp = new Date(Date.now() + (10 * 60 * 1000))
  console.log(expireOtp);
  

  bcrypt.hash(password, 10, (err, hash) => {
    const user = new userSchema({
    firstName,
    lastName,
    email,
    password: hash,
    token: token,
    otp,
    expireOtp
  });
  user.save();
  // emailVerification(email, otp)
  })
  res.json({
    message: "Data send",
  })

  
}

module.exports = signupController;
