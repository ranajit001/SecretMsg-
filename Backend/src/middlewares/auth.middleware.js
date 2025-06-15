import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config()


export const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization?.split(' ')[1];
    const cookieToken = req.cookies?.token.split(' ')[1];
    const bodyToken = req.body?.token.split(' ')[1];

    const token = authHeader || cookieToken || bodyToken;

        if (!token) 
            return res.status(401).json({ error: "Access Denied. No token provided." });

    try {
        const verify = jwt .verify(token,process.env.jwt);
        req.user = verify;
        next();
    } catch (error) {
         if (error.name === "TokenExpiredError") 
            return res.status(401).send(`<h2>No user found... 24 hrs passed after account creation...</h2>`)
         res.status(401).json({ error: "Invalid token" });
    }
}

