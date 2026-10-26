import express from "express"
import {askToAssistant, getCurrentUser, updateAssistant} from "../controller/user.controller.js"
import isAuth from "../middlewares/isAuth.js"
import multer from "multer"
import upload from "../middlewares/multer.js"
const usersRouter = express.Router()

usersRouter.get("/current",isAuth,getCurrentUser)
usersRouter.post("/update",isAuth,upload.single("assistantImg"),updateAssistant)
usersRouter.post("/asktoassistant",isAuth,askToAssistant)
export default usersRouter