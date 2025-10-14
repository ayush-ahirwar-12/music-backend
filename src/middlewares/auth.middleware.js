const jwt = require("jsonwebtoken");
const cacheClient = require("../services/cache.service");
const userModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const isBlacklisted = await cacheClient.get(token);
    if (isBlacklisted) {
      return res.status(422).json({ message: "Token is blacklisted" });
    }

    let decode;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await userModel.findById(decode.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("error in auth middleware ->", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
