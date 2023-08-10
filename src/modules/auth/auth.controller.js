import userModel from "../../../Db/models/userModel.js"
import cloudinary from "../../utils/cloudinary.js";
import bc from 'bcryptjs'
import { tokengenerator } from "../../utils/tokenFunction.js";
// sign up 
export const signup =async (req,res,next) => {
    const {name,email,password} = req.body
    const emailexist = await userModel.findOne({email});
    if (emailexist) {
        return next(new Error('email already exist',{cause:400}))
    }

    const newUser = new userModel({name,email,password});

    if (req.file) {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder:`profile/${name}`
        })
        newUser.pic = secure_url
        newUser.pic_publicId = public_id
    }

 const savedUser =    await newUser.save()
 if (!savedUser) {
    return next (new Error('fail'))
 }
 res.status(201).json({message:'signup success',savedUser})
    
}

// login 
export const login = async (req,res,next) =>{
    const {email,password} = req.body;
    const userExist = await userModel.findOne({email});
    if (!userExist) {
        return next(new Error('invalid email ',{cause:404}))
    }
  const matchPassword = bc.compareSync(password,userExist.password)
    if (!matchPassword) {
        return next(new Error('invalid password ',{cause:404}))   
    }

    const token = tokengenerator({payload:{_id:userExist._id,name:userExist.name}});
   
    if (!token) {
        return next(new Error('token fail'))
    }
    const loggedUser = await userModel.findByIdAndUpdate(userExist._id,{isLoggedIn:true},{new:true});
    res.status(200).json({message:'done',loggedUser,token})



}


// serach user 
export const searchUser = async(req,res,next) =>{
    const {search} = req.query;
    if (search ==='') {
        return  res.status(200).json({message:"no users"})
    }
    const users = await userModel.find({$or:[
        {name:{$regex:search,$options:'i'}},
        {email:{$regex:search,$options:'i'}},
    ],_id:{$ne:req.user._id}})
 
    res.status(200).json({message:"done",users})

}
