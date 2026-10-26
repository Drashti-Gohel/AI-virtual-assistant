import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.models.js"
import moment from "moment"
// import {
//   openApp,
//   closeApp
  
// } from "./utils/systemActions";
export const getCurrentUser = async (req,res)=>{
    try{
        const userId = req.userId
        if(!userId){
            return res.status(401).json({message:"user id not found"})
        }
        const user = await User.findById(userId).select("-password") 
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
         return res.status(200).json(user)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message:"current user error"})
    }
}

export const updateAssistant = async(req,res)=>{
    try{
        const {assistantName,imageUrl} = req.body
        let assistantImg
        if(req.file){
            assistantImg = await uploadOnCloudinary(req.file.path)
        }else{
            assistantImg = imageUrl
        }

        const user = await User.findByIdAndUpdate(req.userId,{assistantName,assistantImg},{returnDocument: 'after'}).select("-password")

        return res.status(200).json(user)
    }catch(error){
        console.error("updateAssistant error:",error)
          return res.status(500).json({message:"update assistant  error"})
    }
}

export const askToAssistant =async(req,res)=>{
    try{
        if (!req.userId) {
      return res.status(401).json({ response: "Unauthorized" })
    }
        const {command}=req.body
       
        if (!command) {
      return res.status(400).json({ response: "Command is required" })
    }
        const user = await User.findById(req.userId);
        if (!user) {
      return res.status(404).json({ response: "User not found" })
    }
        user.history.push(command)
        await user.save()
        const name = user.name 
        const assistantName = user.assistantName

        console.log("BODY:", req.body);

console.log("Command:", command);
console.log("Assistant:", assistantName);
console.log("User:", name);



        const result = await   geminiResponse(command,assistantName,name)
       if (!result) return res.status(500).json({ response: "Empty AI response" })





console.log("Gemini Result:");
console.log(result);
console.log(typeof result);

        const jsonMatch =result.match(/{[\s\S]*}/)
        if(!jsonMatch){
            return res.status(500).json({response:"i cant understand "})
        }

        console.log("JSON Match:");
console.log(jsonMatch);
        const gemresult = JSON.parse(jsonMatch[0])
        const type =gemresult.type
        switch(type){
        case 'get_day':
            return res.json({type,userinput:gemresult.userinput,response:`Today is ${moment().format("dddd")}`});   
        case 'get_time':
            return res.json({type,userinput:gemresult.userinput,response:`Current time is ${moment().format("hh:mm A")}`});   
        case 'get_date':
            return res.json({type,userinput:gemresult.userinput,response:`Today date is ${moment().format("YYYY-MM-DD")}`});   
        case 'get_month':
            return res.json({type,userinput:gemresult.userinput,response:`The month  is ${moment().format("MMMM")}`});   
        case 'google_search':
        case 'youtube_search':
        case 'google_open':
        case 'youtube_open':
        case 'youtube_play':
        case 'general':
        case 'calculator_open':
        case 'instagram_open':
        case 'facebook_open':
        case 'whatsapp_open':
        case 'spotify_open':
        case 'weather_show':
        return res.json({type,userinput:gemresult.userinput,response:gemresult.response})

   
    default:
     return res.status(400).json({response:"I didnt understand the command"})
        }
    }catch(error){
       

        console.error("FULL ERROR:");
    console.error(error);

    return res.status(500).json({
        response:"ask assistant error",
        error:error.message,
        stack:error.stack
    });
    }
}