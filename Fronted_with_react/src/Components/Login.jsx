import { useState } from "react";
import './Login.css';
import { baseApi } from "../utils/baseApi";
import { useAuth } from "../Contexts/AuthContext";
import {X}from 'lucide-react'


export const LoginForm = ({setFormType})=>{
        const{LoginOrRegister} = useAuth();




    const [form,setForm] = useState({username:'',password:null,error:null});

    const loggingin = async(e)=>{
                            e.preventDefault();

                            if(!form.username.trim()|| !form.password) {
                                alert('Oops! Looks like you missed something. Please complete all fields...')
                                return
                            }
                
                try {
                    const res = await fetch(`${baseApi}/user/login`,{
                        credentials: "include", 
                        method:'POST',
                        headers:{
                            'Content-type':'application/json',
                        },
                        body:JSON.stringify({username:form.username.trim(),password:form.password})
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
    }
    const handleChenge = (e)=>{
              const {name,value} = e.target;
             setForm((prev)=>({...prev,[name]:value,error:null}));
        
    }

    
        return (
    <div className="login-container">
        <div className="close-btn" onClick={() => setFormType(null)}><X/></div>
        <h2>Teleport inside!🚀</h2>
    <form onSubmit={loggingin}>

        <label htmlFor="reg-username">Username:</label>
        <input type="text" id="reg-username" name="username"  onChange={handleChenge} placeholder="Enter your username..."/>

        <label htmlFor="reg-password">Password:</label>
        <input type="password" id="reg-password" name="password"  onChange={handleChenge} placeholder="Enter your password..."/>

        <p style={{color:'red'}}>{form.error}</p>

        <button type="submit">Get Link</button>
    </form>
  </div>
);
}