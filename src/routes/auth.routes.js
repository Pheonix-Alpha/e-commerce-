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
    passport.authenticate("google",{failureRedirect:  process.env.FRONTEND_URL + "/login"}),
     (req, res) => {
    // Successful login

     const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Redirect to frontend route with token in query (demo-friendly)
   const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${encodeURIComponent(
      token
    )}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`;

    return res.redirect(redirectUrl);
  }
);





router.get("/profile", verifyToken, (req,res) => {
    res.json({msg:"profile fetch", user:req.user})
});

export default router;