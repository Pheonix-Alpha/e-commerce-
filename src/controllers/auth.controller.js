import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: "user already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });

    await user.save();

    res.json({ msg: "user registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "user not found" });

    const isMatch = await bcrypt.compare(password,user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credential" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

   res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
