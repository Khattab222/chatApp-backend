import express from 'express'
import { chats } from './data/data.js'
import cors from'cors'
import { config } from "dotenv";
import { connectionDb } from './Db/connection.js';
import * as allRouter from './src/index.routes.js'
import { globalError } from './src/utils/errorhandling.js';
import { Server } from 'socket.io';
const app = express()
app.use(express.json())
config({path:'./config/dev.env'})
const port = process.env.PORT 


app.use(async (req,res,next) => {

await res.header('Access-Control-Allow-Origin','*');
await res.header('Access-Control-Allow-Headers','*');
await res.header('Access-Control-Allow-Private-Network','true');
await res.header('Access-Control-Allow-Methods','PUT');

next()
}
)



connectionDb()



app.get('/',(req,res,next) => {
  return res.status(200).json({message:'welcome to chat app'})
})
app.use('/auth', allRouter.authRouter)
app.use('/chat', allRouter.chatRouter)



 // in-valid routings
 app.all('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method")
})

app.use(globalError)

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const io = new Server(server,{
    pingTimeout:60000,
    cors:'*'
});

io.on('connection',socket =>{
// console.log("connected to socket io");
socket.on('setup',(userData) => {
   socket.join(userData?._id)

    socket.emit('connected');
  
})

socket.on('joinchat',(room) =>{
    socket.join(room);

    io.sockets.in(room).emit(`connectedRoom`,`u are in room ${room}`)

})
socket.on('newMessage',(newMessage) =>{
   let toRoom = newMessage.messages[newMessage.messages.length-1].to;
    if (!newMessage.isGroupChat) {
        socket.in(toRoom).emit("recieveMessage",newMessage)
    }
  socket.in(newMessage._id).emit("recieveMessage",newMessage)
})


socket.on('typing',(room) =>{
    socket.in(room).emit('typing',room)
})
socket.on('stopTyping',(room) =>{
    socket.in(room).emit('stopTyping',room)
})


 socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });
    socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

})