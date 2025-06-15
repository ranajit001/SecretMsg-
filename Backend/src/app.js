import express from "express";
import http from 'http';
import cors from 'cors'

import { UserRouter } from "./routes/auth.router.js";
import { MsgRouter } from "./routes/msg.router.js";
import { usernameValidator } from "./controllers/user.controller.js";
import { Server } from "socket.io";
import { connectDB } from "./configs/db.js";
import './configs/cronjob.js'

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' })); 

app.use('/',UserRouter);
app.use('/',MsgRouter);
app.get('/cronjob',(req,res)=> res.json({msg:'running'}))

const port = +process.env.PORT;

const server = http.createServer(app);
const io = new Server(server,{
    cors:'*' 
});


io.on('connection',(socket)=>{
    socket.on('username_Validation',async(username)=>{
        socket.emit('username_Validation', await usernameValidator(username))
    })
});

server.listen(port,async()=>{
    await connectDB();
    console.log('server started...');
    
})


