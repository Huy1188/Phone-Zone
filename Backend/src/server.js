import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import connectDB from "./config/connectDB";

import apiRouter from "./routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// parse body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS cho Next.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

// session
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
  },
}));

// static images
app.use("/static", express.static("src/public"));
app.use("/img", express.static("static/img"));



// API routes
app.use("/api", apiRouter);


// 404 JSON
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// error handler JSON
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

connectDB();

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("API running on port:", port));
