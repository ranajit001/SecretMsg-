import { UserModel } from "../models/user.model.js";
import { allUserModel } from "../models/allusers.model.js";
import  argon2  from "argon2";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config()

const token = (user,time ='24h')=> jwt.sign({id:user._id,username:user.name},process.env.jwt,{expiresIn:time});



  // geneerate jwt token expire time according to time left from 24 hrs
const timeRemain = (user)=>{
            const createdAt = new Date(user.createdAt);
            const diff = new Date() - createdAt; //calculating totla time passed from 24 hrs
            const fullDay = 24 * 60 * 60 * 1000; // 24 hours in ms
            let ans = Math.floor((fullDay-diff)/1000)
            return ans>0 ? ans :null;
}

const createdAt_to_dateAndTime = (isoString) => {
  const date = new Date(isoString);
  date.setDate(date.getDate() + 1); // add 24h

  const options = {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata' // 💥 Force IST even in UTC servers
  };

  return date.toLocaleString('en-IN', options);
};








export const register = async(req,res)=>{   


    try {
        let {name,username,password} = req.body;
        password = password.trim();
        if(!name.trim() || !password || !username.trim())
                return res.status(400).json({message:'name username and password is required.'});
        
        const hash = await argon2.hash(password);
        const user = await UserModel.create({name,username,password:hash});      
        
            await allUserModel.create({name}) // => only saving name of register user permanently...
res
  .cookie("token", token(user), {httpOnly: true,  secure: false,sameSite: "strict",maxAge: 1000 * 60 * 60 * 24,  })
  .status(200)
  .json({
      id: user._id,
      message: "created",
      name: user.name,
      createdAt: createdAt_to_dateAndTime(user.createdAt),
  });

        
    } catch (error) {
        if (error.code == 11000)return res.status(409).json({message:'This username is already taken'})
         res.status(500).json({message:`${error.message} server error`})
         console.log(error);
         
    }
};

//getting new token
export const login = async(req,res)=>{
    try {
        let {name,username,password}= req.body;
        username = username?.trim();
        password= password?.trim()
        if(!username || !password)
                return res.status(400).json({message:'Please enter username and password.'});
        const user = await UserModel.findOne({username});
        if(!user)
            return res.status(400).json({message:'Invalid username'});


        if(await argon2.verify(user.password,password))
            return res
        .cookie('token',token(user,timeRemain(user)),{httpOnly: true,  secure: false,sameSite: "strict" ,maxAge:timeRemain(user)})
        .status(200).json(
        {
            id:user._id,
            message:'login success',   
            name:user.name ,
            createdAt:createdAt_to_dateAndTime(user.createdAt)
        }
      );
            res.status(400).json({message:'Invalid password'})
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:`Server error,${error.messae}`})
    }
}

//it will be used in socket.io to ckeck username uniqueness while register
export const usernameValidator = async(username)=>{ console.log(username,'user');

 // exported to app.js
    try {
        if(!username && !username.trim())
            return {message:'Please provide a usrname',status:400,username}
        const user = await UserModel.findOne({username});
        if(user) 
           return {message:'This username is already taken',status:409,username};
        return{message: 'This username is available!',status:200,username}
    } catch (error) { console.log(error,'error from username validation check');
    
        return {message:'server error',status:500,username}
    }
}



//it will be called in every home page reload to verify jwt token from middleware;
export const loginStatusCheck = (req,res)=>{
    res
    .clearCookie('token',{
        httpOnly: true,
          secure: false,
          sameSite: "strict",
    })
    .status(200).json({message:'ok'})
}


