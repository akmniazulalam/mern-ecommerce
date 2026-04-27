const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const routes = require("./routes");
app.use(express.json());

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-ecommerce-sigma-nine.vercel.app",
      "https://orebi-sigma.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(
  session({
    secret: "ecommerceApi",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "none",
      httpOnly: true,
    },
  }),
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", routes);

module.exports = app;
