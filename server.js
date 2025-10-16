require("dotenv").config();
const express = require("express");
const songRoutes = require("./src/routes/song.route");
const cors = require("cors");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const userRoutes = require("./src/routes/user.route");
// const connecDb = require("./src/db/db");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
     allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookie());

let isConnected = false;
async function connectoMongoDb() {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("connect to db");
  } catch (error) {
    console.log("error connecting to mongoDb", error);
  }
}

app.use((req, res, next) => {
  if (!isConnected) {
    connectoMongoDb();
  }
  next();
});

app.use("/api", songRoutes);
app.use("/api/auth", userRoutes);

app.listen(4000, () => {
  console.log("server Connected");
  // connecDb();
});

module.exports = app;
