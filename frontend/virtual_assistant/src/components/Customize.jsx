import React ,{useContext, useRef , useState}from 'react'
import Card from './Card.jsx'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import { RiImageAddFill } from "react-icons/ri";
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";


function Customize() {
    const {serverUrl , userData ,setUserData ,backendImage,setBackendImage ,frontendImage,setFrontendImage,selectedImage,setSelectedImage} = useContext(userDataContext)

    const inputImage = useRef(null)
    const navigate = useNavigate()
    const handleImage=(e)=>{
        const file = e.target.files[0]
       setBackendImage(file)
       setFrontendImage(URL.createObjectURL(file))
    }
    return (
    <div className='  w-full h-screen bg-linear-to-t from-black to-blue-800  flex justify-center items-center flex-col'>
            <IoArrowBack onClick={()=>{navigate("/")}} className='absolute top-7.5 left-7.5 h-6.25 w-6.25 text-white cursor-pointer' />
    
       <h1 className='text-white text-2xl text-center mb-7.5'> Select your preferred <span className='text-blue-700'>Avatar</span> </h1>
        <div className= 'w-90% max-w-225 flex justify-center items-center flex-wrap gap-10'>
      <Card  image={image1}/>
      <Card  image={image2}/>
      <Card  image={image4}/>
      <Card  image={image5}/>
       <div className={`w-20 h-30 lg:w-35 lg:h-60 bg-[#030326] border-2 border-blue rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blu-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center 
       ${selectedImage==="input"?"border-white border-4 shadow-2xl shadow-blue-950":null}`}
        onClick={(e)=>{
            inputImage.current.click()
            setSelectedImage("input")
            }}>
      {!frontendImage &&  <RiImageAddFill className='text-white w-6.25 h-6.25 '/>}
     {frontendImage && <img className='h-full object-cover' src={frontendImage}/>}
    </div>
    <input type="file" accept='image/*' hidden ref={inputImage} onChange={handleImage}/>
      </div>
    {selectedImage && <button onClick={()=>navigate("/customize2")} className=' cursor-pointer min-w-37 text-black font-semibold h-12 bg-white rounded-3xl mt-10' >Next</button>}
      
       
    </div>
  )
}

export default Customize