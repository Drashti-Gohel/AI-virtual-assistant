import jwt from 'jsonwebtoken'

const genToken =  (userId)=>{
    try{
    return  jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"1d"})

    return token
    }
    catch(error){
        console.log(error)
    }

}

export default genToken