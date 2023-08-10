import multer from 'multer'

export const validationObject = {
    image:['image/png', 'image/jpeg'],
}



export const multerCloudinary = ({fileValidation=validationObject.image}={}) =>{


    const storage = multer.diskStorage({})

    const fileFilter = (req,file,cb) =>{
        if (fileValidation.includes(file.mimetype)) {
        return    cb(null,true)
        }else{
            return cb(new Error('invalid file extension'),false)
        }
    }
const uploads = multer({fileFilter,storage})
return uploads
}

