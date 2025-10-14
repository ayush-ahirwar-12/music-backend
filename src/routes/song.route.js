const express = require("express")
const router = express.Router();
const multer = require("multer");

const songModel = require("../models/song.model");
const { UploadSongController, getSongController, userSongUploader, getSongofUserController } = require("../Controllers/song.controller");
const authMiddleware = require("../middlewares/auth.middleware");







const upload = multer({storage:multer.memoryStorage(),limits: { fileSize: 50 * 1024 * 1024 }, });
router.post("/allSong",upload.single("audio"),UploadSongController)

router.get("/song",getSongController);

router.post("/userSong",authMiddleware,upload.single("audio"),userSongUploader)

router.get("/getsongofuser",authMiddleware,getSongofUserController);




module.exports=router;