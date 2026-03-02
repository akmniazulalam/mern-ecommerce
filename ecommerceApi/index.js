require('dotenv').config()
const express = require("express");
const path = require('path');
const cors = require('cors');
const session = require("express-session")
const dbConnection = require("./database/dbConnection");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(cors())
const route = require('./route')

app.use(session({
  secret: 'ecommerceApi',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(route)

dbConnection()

app.listen(port, () => {
  console.log("Server Running on port 3000");
});
