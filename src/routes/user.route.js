const express = require("express");
const userModel = require("../models/user.model");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { RegisterUserController, loginUserController, logoutUser } = require("../Controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Cuurent loggedin user",
    user: req.user,
  });
});

router.post("/register" ,RegisterUserController);

router.post("/login",loginUserController);

router.post("/logout",logoutUser)

module.exports=router;