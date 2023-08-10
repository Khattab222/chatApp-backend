import userModel from "../../Db/models/userModel.js";
import { tokeDecode } from "../utils/tokenFunction.js";


export const auth = (accessRoles) => {
  return async (req,res,next) =>{
    try {
        const {authorization} = req.headers;
        if (!authorization) return next(new Error('please login ...........',{cause:400}))
        if (!authorization.startsWith('chat__')) {
            return next(new Error('invalid prefix',{cause:400}))
        }
        const separatedToken = authorization.split('chat__')[1]
        const decode = tokeDecode({payload:separatedToken});
       
        if (!decode._id) {
            return next(new Error('decode fail',{cause:400}))
        }
        const user = await userModel.findById(decode._id).select('-password');
        if (!user) {
            return next(new Error('user not exist any more',{cause:400}))
        }
        if (accessRoles) {
            if (!accessRoles.includes(user.role)) {
                return next(new Error('Not authorized',{cause:400}))
                
            }
        }
        req.user = user;
        next()
    } catch (error) {
        return res.json({ message: "Catch error in auth" , err:error?.message })
    }
  }
}
