import React ,{useState,useContext}from 'react'
import bg from '../assets/bg.jpg'
import {useNavigate} from 'react-router-dom'
import { userDataContext} from '../context/UserContext.jsx'
import axios from 'axios'

function SignUp() {
  
  const [showPassword,setShowPassword] = useState(false)
  const {serverUrl, userData, setUserData} = useContext(userDataContext)
  const [name,setName] = useState("")
  const [email,setemail] = useState("")
  const [password,setPassword] = useState("")
  const [err,setErr] =useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
 
  const handleSignUp = async(e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    
    try{
      let result = await axios.post(`${serverUrl}/api/auth/signup`, { name, email, password }, { withCredentials: true })
      console.log(result)
      setUserData(result.data)
      setLoading(false)
       navigate("/customize")
    } catch (error) {
      console.error("Error signing up:", error.message)
      setUserData(null)
      setLoading(false)
     
      setErr(error.response.data.message)
    }
  }
  return (
    <div className = 'w-full h-screen bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
     
      <form className=' px-5 w-[90%] h-150 max-w-125 bg-[#00000062] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-5  ' onSubmit={handleSignUp}>
      <h1 className='text-3xl font-bold mb-7.5 text-white'> Register to <span className='text-blue-500'>Virtual Assistant</span> </h1>
     <input type="text" required onChange={(e)=>setName(e.target.value)} value={name} placeholder='Enter your name' className='p-5 w-full   h-15 outline-none border-2 rounded-xl border-white bg-transparent text-white placeholder-gray-300'/>
     <input type="email" required onChange={(e)=>setemail(e.target.value)} value={email} placeholder='Enter your email' className='p-5 w-full   h-15 outline-none border-2 rounded-xl border-white bg-transparent text-white placeholder-gray-300'/>
    
     <input type="password" required onChange={(e)=>setPassword(e.target.value)} value={password} placeholder='Enter your password' className='p-5 w-full   h-15 outline-none border-2 rounded-xl border-white bg-transparent text-white placeholder-gray-300'/>
  {err.length>0 && <p className='text-red-500'> *{err}</p>}
    <button className='min-w-37 text-black font-semibold h-12 mt-2 bg-white rounded-3xl cursor-pointer' disabled={loading} >{ loading ? "Signing Up..." : "SignUp" }</button>
    <div className='text-white ' >
      Already have an account? <span  onClick={()=>{navigate("/signin")}} className='text-blue-500 cursor-pointer underline'>SignIn</span>
    </div>
      </form>
      </div>
  )
}

export default SignUp

