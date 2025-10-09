const express = require("express")
const router = express.Router();
const multer = require("multer");

const songModel = require("../models/song.model");
const { UploadSongController } = require("../Controllers/song.controller");







const upload = multer({storage:multer.memoryStorage()});
router.post("/song",upload.single("audio"),UploadSongController)

router.get("/song",async(req,res)=>{
    const song = await songModel.find();
    res.status(200).json({
        message:"songs fetched successfully",
        song
    })
})



module.exports=router;