const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    userName:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    }
    ,
    songs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"song"
        }
    ]
})

userSchema.methods.jwtTokenGeneration = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};


const userModel = mongoose.model("user",userSchema);


module.exports=userModel;