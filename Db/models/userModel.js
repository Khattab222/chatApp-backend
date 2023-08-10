import { Schema, model } from "mongoose";
import bc from 'bcryptjs'


const userSchema = new Schema({
    name:{type:String,trim:true,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    pic:{type:String,required:false,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    pic_publicId:{type:String},
    isLoggedIn :{type:Boolean,default:false}
},{timestamps:true})



userSchema.pre('save', function (next,doc) {
    this.password = bc.hashSync(this.password,6);
    next()
} )

const userModel = model.User || model("User",userSchema)
export default userModel