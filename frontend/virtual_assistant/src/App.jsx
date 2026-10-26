import React ,{useContext} from 'react'
import {Routes ,Route, Navigate} from 'react-router-dom'
import SignUp from './components/SignUp.jsx'
import SignIn from './components/SignIn.jsx'
import Customize from './components/Customize.jsx'
import Customize2 from './components/Customize2.jsx'

import Home from './components/Home.jsx'
import { userDataContext} from './context/UserContext.jsx'

function App() {
  const {userData,setUserData} = useContext(userDataContext)
  return (
   <Routes>
    <Route path='/' element={(userData?.assistantImg && userData?.assistantName)?   <Home/> : <Navigate to={"/customize"}/>} />
    <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
    <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}  />
   <Route path='/customize' element={userData?<Customize/>:<Navigate to={"/signup"}/>}/>
    <Route path='/customize2' element={userData?<Customize2/>:<Navigate to={"/signup"}/>}/>

   </Routes>
  )
}

export default App