import multer from 'multer'

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{   //where to store file
        cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname) //name of file
    }
})

const upload = multer({storage})
export default upload