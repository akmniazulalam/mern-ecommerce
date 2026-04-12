const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const routes = require("./routes");
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mern-ecommerce-sigma-nine.vercel.app"],
    credentials: true,
  }),
);
app.use(
  session({
    secret: "ecommerceApi",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", routes);

module.exports = app;
