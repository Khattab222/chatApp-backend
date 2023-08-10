import { Schema, model } from "mongoose";



const chatSchema = new Schema({
    chatName : {type:String , trim:true},
    isGroupChat :{type:Boolean,default:false},
    POne:{type:Schema.Types.ObjectId,ref:'User'},
    PTwo:{type:Schema.Types.ObjectId,ref:'User'},
    groupUsers:[{
        type:Schema.Types.ObjectId,
        ref:"User",
     
    }],
   messages:[{
    from:{type:Schema.Types.ObjectId,ref:'User'},
    to:{type:Schema.Types.ObjectId,ref:'User'},
    messageText:{type: String,required:true}
   }],
    groupAdmin:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true
})


const chatModel = model.Chat || model("Chat",chatSchema);
export default chatModel