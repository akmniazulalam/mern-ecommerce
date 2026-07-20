const mongoose = require("mongoose");
const { getEnv } = require("./env");

function db() {
  mongoose.connect(getEnv("DB_URL")).then(() => console.log("DB Connected"));
}

module.exports = db;
