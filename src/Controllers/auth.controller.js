const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cacheClient = require("../services/cache.service");

const RegisterUserController = async (req, res) => {
  try {
    const { userName, mobile, email, password } = req.body;

    // 1️⃣ Validate fields
    if (!userName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check for existing user
    const ifUserExists = await userModel.findOne({
      $or: [{ userName }, { mobile }, { email }],
    });
    if (ifUserExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await userModel.create({
      userName,
      email,
      mobile,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(500).json({ message: "Error creating user" });
    }

    // 5️⃣ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Set cookie (optional for authentication)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // 7️⃣ Return user without password
    // const { password: _, ...userData } = user._doc;

    return res.status(201).json({
      message: "User created successfully",
      user: user, // ✅ now you get this on frontend
      token, // (optional)
    });
  } catch (error) {
    console.log("Error in RegisterUserController:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



const loginUserController=async (req, res) => {
try {
      const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404).json({
      message: "user not found",
    });
  }
  const isvalidpassword = await bcrypt.compare(password,user.password)
  if (!isvalidpassword) {
    res.status(408).json({
      message: "wrong password",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  );
  res.cookie("token",token)

  return res.status(200).json({
    message: "user login successfully",
    user,
    token
  });
} catch (error) {
    console.log(error);
    res.status(401).json({
        message:"errror in user register"
    })
}
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(404).json({
        message: "token not found",
      });
    }
    await cacheClient.set(token, "blacklisted");
    res.clearCookie("token");
    res.status(200).json({
      message: "user logout successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal server error",
    });
    console.log("error-->", error);
  }
};

module.exports = { RegisterUserController , loginUserController,logoutUser};
