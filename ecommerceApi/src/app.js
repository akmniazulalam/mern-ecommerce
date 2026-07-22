const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const routes = require("./routes");
const { getEnv } = require("./common/config/env");
const { errorHandler } = require("./common/middleware/errorHandler");
app.use(express.json());

app.set("trust proxy", 1);

const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = getEnv("SESSION_SECRET");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mern-ecommerce-sigma-nine.vercel.app",
      "https://orebi-sigma.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(
  session({
    name: "ecommerce.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: getEnv("DB_URL") }),
    cookie: {
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: isProduction ? "none" : "lax",
      httpOnly: true,
    },
  }),
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", routes);
app.use(errorHandler);

module.exports = app;
