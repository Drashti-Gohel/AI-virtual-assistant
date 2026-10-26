
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
const uploadOnCloudinary = async (filepath) => {
     cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    try{
       
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
            filepath
       )
       fs.unlinkSync(filepath) //delete file from server after uploading on cloudinary
       return uploadResult.secure_url
      
    }
    catch(error){
        fs.unlinkSync(filepath) //delete file from server if error occurs
        return res.status(500).json({message:"Error uploading file"})
    }
}
export default uploadOnCloudinary