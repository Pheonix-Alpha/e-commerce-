import express from "express"
import {login , register} from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js";
import passport from "passport";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//google auth

router.get(
    "/google",
    passport.authenticate("google", {scope:["profile", "email"]})
);

router.get(
    "/google/callback",
    passport.authenticate("google",{failureRedirect: "/login"}),
     (req, res) => {
    // Successful login
    res.json({ msg: "Google Auth Success", user: req.user });
  }
);





router.get("/profile", verifyToken, (req,res) => {
    res.json({msg:"profile fetch", user:req.user})
});

export default router;