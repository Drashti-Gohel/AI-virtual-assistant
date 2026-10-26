import React,{useContext} from 'react'
import { userDataContext } from '../context/UserContext.jsx'

function Card({image}) {
     const {serverUrl , userData ,setUserData ,backendImage,setBackendImage ,frontendImage,setFrontendImage,selectedImage,setSelectedImage} = useContext(userDataContext)
    
  return (
<div  className= {`w-20 h-30 lg:w-35 lg:h-60 bg-[#030326] border-2 border-blue rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
    ${selectedImage===image?"border-white border-4 shadow-2xl shadow-blue-950":null}`} onClick={()=>{setSelectedImage(image) ,setBackendImage(null),setFrontendImage(null)} }>
       <img src={image} className='h-full object-cover rounded-2xl ' />
    </div>
  )
}

export default Card