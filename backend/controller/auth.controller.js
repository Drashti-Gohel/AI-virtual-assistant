import User from "../models/user.models.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
export const signup = async(req,res)=>{
try{
    const {name,email,password} = req.body //takes data
    const existEmail = await User.findOne({email})
    if(existEmail){
        return res.status(400).json({message:"email already exist"})
    }

    if(password.length<6){
        return res.status(400).json({message:"password must be at least 6 characters"})
    }

    const hashPWD = await bcrypt.hash(password,10)

    const user  =await User.create({name,password:hashPWD,email})

    const token = await genToken(user._id)
    res.cookie("token",token,
        {httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false

    })
    return res.status(201).json({message:"user created successfully",token}) //token generated so 201
}catch(error){
    return res.status(500).json({message:"internal server error"})
}
}

export const login = async(req,res)=>{
try{
    const {email,password} = req.body //takes data
    const existEmail = await User.findOne({email})
    if(!existEmail){
        return res.status(400).json({message:"email does not exist"})
    }

    if(!await bcrypt.compare(password, existEmail.password)){
        return res.status(400).json({message:"invalid credentials"})
    }

 
    const token = await genToken(existEmail._id)
    res.cookie("token",token,
        {httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false

    })
    return res.status(200).json({message:"user logged in successfully",user:{
   _id: existEmail._id,
   name: existEmail.name,
   email: existEmail.email
 }}) //token generated so 200
 
}catch(error){
    return res.status(500).json({message:"internal server error"})
}
}

export const logout = async(req,res)=>{
    try{ // we have to remoce token from cookie
        res.clearCookie("token")
        return res.status(200).json({message:"User logged out"})


    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}