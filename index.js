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
app.use(cors({ origin: true }));



connectionDb()



app.get('/', (req, res) => res.send('selcome to chat app'))
app.use('/auth', allRouter.authRouter)
app.use('/chat', allRouter.chatRouter)



 // in-valid routings
 app.all('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method")
})
app.use(globalError)

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const io = new Server(server);

io.on('connection',socket =>{
console.log(socket)
})