const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    otp: {
      type: String,
    },
    expireOtp: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("userList", userSchema);
