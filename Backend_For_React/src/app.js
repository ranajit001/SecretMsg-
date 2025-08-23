import express from "express";
import http from 'http';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { UserRouter } from "./routes/auth.router.js";
import { MsgRouter } from "./routes/msg.router.js";

import { usernameValidator } from "./controllers/user.controller.js";
import { getMsg } from "./controllers/msg.controller.js";

import { frontedUrl } from "./utils/utils.js";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

import { Server } from "socket.io";
import { connectDB } from "./configs/db.js";
import './configs/cronjob.js'


const app = express();
app.use(express.json());

app.use(cors({ origin: frontedUrl,  credentials:true })); 
app.use(cookieParser())

app.use('/user',UserRouter);
app.use('/msg',MsgRouter);


const port = +process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:frontedUrl,
    credentials: true     // allow cookies accepting
  }
});

io.use(async(socket,next)=>{
    const  cookieHeader= socket.request.headers.cookie;
    console.log(cookieHeader,'cookies');

    if (!cookieHeader) 
        return next(new Error("No cookies found")); // socket.io nexxt method stoopsthe connection ,
                                                    // its not like express next(new err) which passes the err to next function
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;
    
    if(!token)  
        return next(new Error("No token found..."));

    try {
        const decoded = jwt.verify(token,process.env.jwt);
        socket.user = decoded
        next()
    } catch (error) {
         return next(new Error(`Invalid token: ${error.message}`));
        
    } 
})



io.on('connection',(socket)=>{
    socket.on('username_Validation',async(username)=>{   console.log('comming in socet.on my-nsgs',username);
        socket.emit('username_Validation', await usernameValidator(username))
    });
    socket.on('My_messages',async(id)=>{
        socket.emit('My_messages',await getMsg(id));
    });
});




app.get('/status',(req,res)=>res.send('Running'))

server.listen(port,async()=>{
    await connectDB();
    console.log('server started...');
    
});