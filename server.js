require("dotenv").config();
const express = require("express");
const songRoutes = require("./src/routes/song.route");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

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

app.use("/", songRoutes);

// app.listen(4000,()=>{
//     console.log("server Connected");

// });

module.exports = app;
