import { Server } from "socket.io";
import { frontedUrl } from "../utils/utils.js";

import { usernameValidator } from "./user.controller.js";


export const socket_Controller = (server)=>{

    const ioPublic = new Server(server,{
                                path:'/public',
                                cors:{
                                    origin:frontedUrl,
                                    credentials:true ,// allow cookies accepting
        }});


    ioPublic.on('connection',(public_socket)=>{ 
             //validationg inputed usrname in register form
            public_socket.on('username_Validation',async(username)=>{  
                public_socket.emit('username_Validation', await usernameValidator(username))
            });
        });
}

