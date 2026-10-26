import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoArrowBack } from "react-icons/io5";
function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
    const [assistantName,setAssistantName] = useState(userData?.assistantName || "") //doubtfull name
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
 
    const navigate=useNavigate()
    const handleUpdateAssistant=async()=>{
        try{
             setLoading(true)
            setError("")

            let formData = new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                formData.append("assistantImg",backendImage)
            }else if (selectedImage){
                formData.append("imageUrl",selectedImage)
            }else{
                  setError("Please select an image")
                setLoading(false)
                return
            }
            const result =await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials :true})
      console.log(result.data)
      setUserData(result.data)
      navigate("/")
        }catch(error){
            setLoading(false)
            console.error("Update assistant error:", error)
            setError(error.response?.data?.message || "Failed to update assistant")
   
        }
    }
  return (
    <div className='  w-full h-screen bg-linear-to-t from-black to-blue-800  flex justify-center items-center flex-col p-10 relative'>
        <IoArrowBack onClick={()=>{navigate("/customize")}} className='absolute top-7.5 left-7.5 h-6.25 w-6.25 text-white cursor-pointer' />
        <h1 className='text-white text-2xl text-center mb-7.5' > Enter your <span className='text-blue-700'> Avatar name </span></h1>
          <input type="text" required  placeholder='Enter name' onChange={(e)=>{setAssistantName(e.target.value)}} value={assistantName} className='p-5 w-full max-w-150   h-15 outline-none border-2 rounded-2xl border-white bg-transparent text-white placeholder-gray-300'/>
      {error && <p className='text-red-500 text-sm mt-3'>{error}</p>}
   
      {assistantName &&   <button disabled={loading} className=' cursor-pointer min-w-45 text-black font-semibold h-12 bg-white rounded-3xl mt-10' onClick={handleUpdateAssistant}> {loading ? "Creating..." : "Create your Assistant"}</button>
      }
        </div>
  )
}

export default Customize2