import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import userRouter from "./router/auth.router.js"
import usersRouter from "./router/user.router.js"
import geminiResponse from "./gemini.js"

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
//we use routers miiddleware adds that path before route handler and form api
app.use('/api/auth',userRouter)
app.use('/api/user',usersRouter) // api for current user
//controller
// app.get("/",(req,res)=>{
//     res.send("hii")
// })
// app.get("/",async(req,res)=>{  //to see the working of gemini model on 8000 server
//     let prompt=req.query.prompt
//     let data =await geminiResponse(prompt)
//     res.json(data) 
// })

app.listen(port,()=>{
    connectDB()

    console.log("server started")
})