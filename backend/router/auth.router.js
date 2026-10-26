import express from "express"
import {signup,login,logout} from "../controller/auth.controller.js"

const userRouter = express.Router()
userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.get("/logout",logout)

export default userRouter