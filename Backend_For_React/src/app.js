import express from "express";
import http from 'http';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { UserRouter } from "./routes/auth.router.js";
import { MsgRouter } from "./routes/msg.router.js";

import { socket_Controller } from "./controllers/socket.io.js";

import { frontedUrl } from "./utils/utils.js";

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

socket_Controller(server)


app.get('/status',(req,res)=>res.send('Running'));

server.listen(port,async()=>{
    await connectDB();
    console.log('server started...');
    
});