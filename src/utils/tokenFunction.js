import jwt from 'jsonwebtoken'


export const tokengenerator =  ({payload,signature=process.env.TOKEN_KEY}={}) =>{
    if (Object.keys(payload).length) {
        const token = jwt.sign(payload,signature);
        return token
    }else{
        return false
    }
}
export const tokeDecode = ({payload='',signature= process.env.TOKEN_KEY}={})=>{
if (!payload) {
    return false
}
const decode = jwt.verify(payload,signature)
return decode
}