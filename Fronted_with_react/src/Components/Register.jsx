import {  useEffect, useRef, useState } from "react";

import { useAuth } from "../Contexts/AuthContext";
import { baseApi } from "../utils/baseApi";
import{X}from 'lucide-react'

import './Register.css'



export const RegisterForm = ({setFormType})=>{
    const [form,setForm] = useState({
        name:'',
        username:'',
        password:'',
        error:null,
        username_message:null,
        username_status:null
    });

    const{LoginOrRegister,public_socket_Ref} = useAuth();

    let typingTimeout = useRef(null); //storing interval in useref because useref servives the re-render
    const public_socket = public_socket_Ref.current
    
        const registering = async(e)=>{
            e.preventDefault();

            if(!form.name.trim()|| !form.username ||!form.password) {
                alert('Oops! Looks like you missed something. Please complete all fields...')
                return
            }

                try {
                    const res = await fetch(`${baseApi}/user/register`,{
                        credentials: "include", 
                        method:'POST',
                        headers:{
                            'Content-type':'application/json',
                        },
                        body:JSON.stringify({name:form.name,username:form.username,password:form.password})
                    });
                    const data = await res.json();  console.log(data);
                    
                   if(res.ok){
                            LoginOrRegister(data)
                            setFormType(null)
                        }
                    else 
                        setForm((prev) => ({ ...prev, error: data.message }));
                } catch (error) { console.log(error);
                        setForm((prev) => ({ ...prev, error: error.message }));
                }
        };

        const handleChenge = (e)=>{
        
            const {name,value} = e.target;  
             setForm((prev)=>({...prev,[name]:value,error:null}));

            if(name=='username' && public_socket){
                if(typingTimeout.current)
                            clearTimeout(typingTimeout.current); //clearing perevious instance
                    typingTimeout.current = setTimeout(()=>{
                         public_socket.emit('username_Validation',value) 
                    },1000)
                
                setForm((prev)=>({...prev,username_message:'Checking',username_status:null}))
            }           
        };



        useEffect(()=>{
             public_socket && public_socket.on("connect_error", (err) => {
                console.log(`Connection error due to ${err.message}`);
                });


            const listner = (res)=>{console.log(res,'fffff');
              setForm(prev=>({...prev,username_message:res.message,username_status:res.status}))        }


               public_socket && public_socket.on(`username_Validation`,listner);

            return ()=> public_socket && public_socket.off("username_Validation",listner)
        },[public_socket_Ref,public_socket])




    return (
    <div className="reg-container">
        <div className="close-btn" onClick={()=>setFormType(null)}><X/></div>
        <h2>Create your account ✨</h2>
    <form onSubmit={registering}>

        <label htmlFor="reg-name">Name:</label>
        <input type="text" id="reg-name" name="name" onChange={handleChenge} placeholder="Enter your name..." />

        <label htmlFor="reg-username">Username:</label>
        <input type="text" id="reg-username" name="username"  onChange={handleChenge} placeholder="Create a username..."/>
        <p className={`${form.username_status==200? 'accept':form.username_status>200?'reject':'checking'}`}>{form.username.trim()? form.username_message : ''}</p>

        <label htmlFor="reg-password">Password:</label>
        <input type="password" id="reg-password" name="password"  onChange={handleChenge} placeholder="Set your password..."/>

        <p style={{color:'#ff0606', }}>{form.error}</p>

        <button type="submit">Generate Link</button>
    </form>
  </div>
);
}