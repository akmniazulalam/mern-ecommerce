const mongoose = require("mongoose");

function db() {
  mongoose.connect(`${process.env.DB_URL}`).then(() => console.log("DB Connected"));
}

module.exports = db;