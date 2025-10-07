const express = require("express")
const router = express.Router();
const multer = require("multer");
const uploadFile = require("../services/storage.service");
const id3 = require("node-id3");
const songModel = require("../models/song.model");







const upload = multer({storage:multer.memoryStorage()});
router.post("/song",upload.single("audio"),async(req,res)=>{
    const buffer = req.file.buffer;
    const response = id3.read(buffer);
    const base64File = Buffer.from(buffer).toString("base64")
    const result = await uploadFile(base64File,"song")
    const coverImageResult = await uploadFile(Buffer.from(response.image.imageBuffer).toString("base64"),"coverImage")

    const song =await songModel.create({
        title:response.title,
        artist:response.artist,
        releaseDate:response.year,
        album:response.album,
        audioUrl:result.url,
        coverImage:coverImageResult.url
    })
    res.status(201).json({
        message:"Song uploaded successfully",
        song
    })
})

router.get("/song",async(req,res)=>{
    const song = await songModel.find();
    res.status(200).json({
        message:"songs fetched successfully",
        song
    })
})



module.exports=router;