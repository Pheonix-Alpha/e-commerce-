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
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
    session: false, // 🚀 important if not using express-session
  }),
  (req, res) => {
    try {
      console.log("✅ Google User:", req.user);

      if (!req.user) {
        return res.status(400).json({ error: "Google authentication failed" });
      }

      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${encodeURIComponent(
        token
      )}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`;

      console.log("➡️ Redirecting to:", redirectUrl);
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("🔥 Google Callback Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);






router.get("/profile", verifyToken, (req,res) => {
    res.json({msg:"profile fetch", user:req.user})
});

export default router;