import mongoose from "mongoose";


export const  connectionDb =async () =>{

    return await mongoose.connect(process.env.DB_URL_LOCAL).then((res) => console.log('db connected sucess'))
    .catch((err) => console.log('fail to connect db ...' , err))

}