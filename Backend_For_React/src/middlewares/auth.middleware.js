import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import { cookiesOptions } from '../utils/utils.js';
config()


export const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization?.split(' ')[1];
    const cookieToken = req.cookies?.token?.split(' ')[1];
    const bodyToken = req.body?.token?.split(' ')[1];

    const token = authHeader || cookieToken || bodyToken;
    console.log(token,'auth middleware tokenn');
    
        if (!token){ 
            return res.clearCookie("token", cookiesOptions)
            .status(401).json({ error: "Access Denied. No token provided." });}

    try {
        const verify = jwt .verify(token,process.env.jwt);
        req.user = verify;
        next();
    } catch (error) { console.log(error,'from auth  middleware');
    
            // Clear cookies whenever token is bad
        res.clearCookie("token", cookiesOptions);
         if (error.name === "TokenExpiredError") 
            return res.status(401).json({message:'No user found... 24 hrs passed after account creation...'});
         res.status(401).json({ error: "Invalid token" });
    }
}

