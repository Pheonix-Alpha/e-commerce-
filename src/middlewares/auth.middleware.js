import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token available" });

  try {
    const decorded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decorded;
    next();
    
  } catch (error) {

     res.status(401).json({ msg: "Token is not valid" });
    
  }

};
