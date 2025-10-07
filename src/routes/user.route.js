const express = require("express");
const userModel = require("../models/user.model");
const router = express.Router();
const jwt = require("jsonwebtoken")


router.post("/signup",async(req,res)=>{
    const {email,password} = req.body;
    const ifUserExists = await userModel.findOne({email})
    if(ifUserExists){
        res.status(201).json({
            message:"user Already exists"
        })
    }


    const user = await userModel.create({
        email:email,
        password:password
    })

        const token = jwt.sign({
            id:user._id,
    },"562486c2894f20f8a357ab91006d98df")

    res.status(200).json({
        message:"user created successfully",
        user
    })

    
})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email})
    if(!user){
        res.status(404).json({
            message:"user not found"
        })
    }
    const isvalidpassword = password===user.password;
    if(!isvalidpassword){
        res.status(408).json({
            message:"wrong password"
        })
    }
    const token = jwt.sign({
        id:user._id
    },"562486c2894f20f8a357ab91006d98df")

    res.status(200).json({
        message:"user login successfully",
        user,
        token
    })

})

module.exports=router;