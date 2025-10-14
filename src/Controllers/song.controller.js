const songModel = require("../models/song.model");
const userModel = require("../models/user.model");
const uploadFile = require("../services/storage.service");
const id3 = require("node-id3");

const UploadSongController = async (req, res) => {
  const buffer = req.file.buffer;
  const response = id3.read(buffer);
  const base64File = Buffer.from(buffer).toString("base64");
  const result = await uploadFile(base64File, "song");
  const coverImageResult = await uploadFile(
    Buffer.from(response.image.imageBuffer).toString("base64"),
    "coverImage"
  );

  const song = await songModel.create({
    title: response.title,
    artist: response.artist,
    releaseDate: response.year,
    album: response.album,
    audioUrl: result.url,
    coverImage: coverImageResult.url,
  });
  res.status(201).json({
    message: "Song uploaded successfully",
    song,
  });
};

const getSongController = async (req, res) => {
  const song = await songModel.find();
  res.status(200).json({
    message: "songs fetched successfully",
    song,
  });
};

const userSongUploader = async (req, res) => {
  // const userId = req.user._id;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({
      message: "user not found",
    });
  }
  console.log(user);

  const buffer = req.file.buffer;
  const response = id3.read(buffer);
  const base64File = Buffer.from(buffer).toString("base64");
  const result = await uploadFile(base64File, "song");
  const coverImageResult = await uploadFile(
    Buffer.from(response.image.imageBuffer).toString("base64"),
    "coverImage"
  );

  const song = await songModel.create({
    title: response.title,
    artist: response.artist,
    releaseDate: response.year,
    album: response.album,
    audioUrl: result.url,
    coverImage: coverImageResult.url,
  });
  user.songs.push(song);
  user.save();

  res.status(201).json({
    message: "Song uploaded successfully",
    song,
  });
};

const getSongofUserController = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({
      message: "user not found",
    });
  }
  const songs = await songModel.find({ _id: { $in: user.songs } });
  res.status(200).json({
    message: "songs fetched successfully",
    songs,
  });
};

module.exports = {
  UploadSongController,
  getSongController,
  userSongUploader,
  getSongofUserController,
};
