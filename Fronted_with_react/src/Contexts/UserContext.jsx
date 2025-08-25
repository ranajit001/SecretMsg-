import { createContext,useState,useEffect, useRef } from "react";
import { baseApi } from "../utils/baseApi";

import {io}from 'socket.io-client';

 const AuthContext = createContext();

export const AuthProvider = ({children})=>{

    const public_socket_Ref = useRef(null);
    const private_socket_Ref = useRef(null);

    const[user,setUser] = useState({id:null,name:null,createdAt:null});

    useEffect(()=>{
        public_socket_Ref.current = io(baseApi,{ withCredentials: true,path:'/public'}); //enabels cookie sharing automatically
        private_socket_Ref.current = io(baseApi,{ withCredentials: true,path:'/private'}); //enabels cookie sharing automatically

        const saved = JSON.parse(localStorage.getItem('user'));
                if(saved && saved.name)
                            setUser(saved)
        return ()=> {
            if(public_socket_Ref.current) public_socket_Ref.current.disconnect();
        }
    },[])


    

    useEffect(()=>{
            if(user && user.name)
                localStorage.setItem('user',JSON.stringify(user))
    },[user]);



    const LoginOrRegister = (user)=>{
        if(!user || !user.name || !user.name.trim()) return
        setUser(user)
    };
    
    const logOut= async()=>{ 
        localStorage.clear();
        setUser({id:null,name:null,createdAt:null});

        await fetch(`${baseApi}/user/logout`,{
                    credentials: "include", 
                    method:'POST',
                    headers:{
                            'Content-type':'application/json',
                        },
        });
    }


    return(<AuthContext.Provider value={{logOut,LoginOrRegister,user,setUser,public_socket_Ref,private_socket_Ref}}>
       {children}
    </AuthContext.Provider>)
}

export default AuthContext