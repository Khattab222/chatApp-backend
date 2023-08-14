
import userModel from './../../../Db/models/userModel.js';
import chatModel from './../../../Db/models/ChatModel.js';


export const accessChat = async (req,res,next) => {
  const {destId} = req.params;
  
  const destuser = await userModel.findById({_id:destId});
  if (!destuser) {
    return next(new Error('invalid user Id',{cause:404}))
  }

  const chat = await chatModel.findOne({
    $or:[
        {POne:req.user._id,PTwo:destId},
        {POne:destId,PTwo:req.user._id},
    ]
  }).populate([
    {
        path:'POne',
        select:'-password'
    },
    {
        path:'PTwo',
        select:'-password'
    },
  ])
  if (chat) {
    return res.status(200).json({message:'done',chat})
  }
 
    let newChat = await chatModel.create({
        POne : req.user._id,
        PTwo : destId,
    })


    return res.status(201).json({message:'done',newChat})

}




export const sendMessage = async (req,res,next) => {
  const {messageText,destId} = req.body;
  if (!messageText) {
    return next(new Error('invalid message or destid',{cause:404}))
    
  }
  const destuser = await userModel.findById({_id:destId});
  if (!destuser) {
    return next(new Error('invalid user',{cause:404}))
  }
  const chat = await chatModel.findOne({
    $or:[
        {POne:req.user._id,PTwo:destId},
        {POne:destId,PTwo:req.user._id},
    ]
  }).populate([
    {
        path:'POne',
        select:'-password'
    },
    {
        path:'PTwo',
        select:'-password'
    },
  ])
  if (!chat) {
    let chat = await chatModel.create({
        POne : req.user._id,
        PTwo : destId,
        messages : [{
            from:req.user._id,
            to:destId,
            messageText
        }]
    })

    chat = await chat.populate([
      {
          path:'POne',
          select:'-password'
      },
      {
          path:'PTwo',
          select:'-password'
      },
    ])
    //// socket emit here //// 
    return res.status(201).json({message:'new done',chat})
  }
  chat.messages.push({
    from:req.user._id,
    to:destId,
    messageText
  })
  await chat.save();
// socket emit here /////
  return res.status(200).json({message:'done',chat})
}

// get user chats 
export const getUserchats = async(req,res,next)=>{
 

  const vovchats = await chatModel.find({
      $or:[
          {POne:req.user._id},
          {PTwo:req.user._id},
          {groupUsers:{$in:req.user._id}},
      ], $where: 'this.messages.length>0' 
    }).populate([
      {
          path:'POne'
      },
      {
          path:'PTwo'
      },
      {
          path:'groupUsers'
      },
    ]).sort({ updatedAt: -1 })
    const groupchats = await chatModel.find({
      isGroupChat:true,
          groupUsers:{$in:req.user._id},
    }).populate([
      {
          path:'POne'
      },
      {
          path:'PTwo'
      },
      {
          path:'groupUsers'
      },
    ]).sort({ updatedAt: -1 })
 const chats = [...vovchats,...groupchats]
    return res.status(200).json({message:'done',chats})

}


// get chat 
export const getchat = async(req,res,next)=>{
    const {destId}= req.params;
    const chat = await chatModel.findOne({
        $or:[
            {POne:req.user._id,PTwo:destId},
            {POne:destId,PTwo:req.user._id},
        ]
      }).populate([
        {
            path:'POne'
        },
        {
            path:'PTwo'
        },
      ])
      return res.status(200).json({message:'done',chat})

}


// creat group chat
export const creatgroup = async (req,res,next) => {
  const {groupUsers,chatName} = req.body;

  if (groupUsers.length < 2) {
    return next(new Error('group must be more than two users'))
  }
  groupUsers.push(req.user._id);


  const groupchat = await chatModel.create({
    chatName,
    groupUsers,
    isGroupChat:true,
    groupAdmin:req.user._id
  })
  const newGroupChat = await chatModel.findOne({_id:groupchat._id}).populate([
    {
        path:'groupUsers'
    },
    {
        path:'groupAdmin'
    },
  ]);
  res.status(201).json({message:'done',newGroupChat})
}



// rename group chat
export const renameGroup =async (req,res,next) =>{
  const {chatName} = req.body;
  const {chatId} = req.params
  const chat = await chatModel.findByIdAndUpdate(chatId,{chatName},{new:true});
  if (!chat) {
    return next(new Error('invalid chat id',{cause:400}))
  }
 res.status(200).json({message:'done',chat})

}


// add user to group
export const addUsertoGroup = async (req,res,next) => {
  const {chatId,userId} = req.params
const chat = await chatModel.findByIdAndUpdate(chatId,{
  $addToSet:{groupUsers:userId}
},{new:true}).populate([
  {
      path:'groupUsers'
  },
  {
      path:'groupAdmin'
  },
])

if (!chat) {
  return next(new Error('invalid id',{cause:404}))
}
res.status(200).json({message:'done',chat})
}

// remove user to group
export const removeUserfromGroup = async (req,res,next) => {
  const {chatId,userId} = req.params
const chat = await chatModel.findByIdAndUpdate(chatId,{
  $pull:{groupUsers:userId}
},{new:true}).populate([
  {
      path:'groupUsers'
  },
  {
      path:'groupAdmin'
  },
])

if (!chat) {
  return next(new Error('invalid id',{cause:404}))
}
res.status(200).json({message:'done',chat})
}

