import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import connectDB from "./config/connectDB";

import apiRouter from "./routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));


app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
  },
}));


app.use("/static", express.static("src/public"));
app.use("/img", express.static("static/img"));




app.use("/api", apiRouter);



app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

connectDB();

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("API running on port:", port));
