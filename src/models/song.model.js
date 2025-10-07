const mongoose = require("mongoose");
const songSchema = new mongoose.Schema({
    title:String,
    artist:String,
    releaseDate:String,
    album:String,
    audioUrl:String,
    coverImage:String,
    
})
const songModel = mongoose.model("song",songSchema)
module.exports=songModel;