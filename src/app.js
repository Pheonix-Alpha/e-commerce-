import "./config.js";
import express from "express";

import mongoose from "mongoose";

import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import "./passport.js";
import session from "express-session";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log(err));

app.listen(5001, () => {
  console.log("Auth service is running");
});
