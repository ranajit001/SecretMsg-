import { MsgModel } from "../models/msg.model.js";
import { UserModel } from "../models/user.model.js";
import mongoose from "mongoose";

export const sendMsg = async (req, res) => {

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) { 
        try { 
            const id = req.query.id;
            const msg = req.body.message.trim(); 

            if (!id )
                return res.status(404).json({message:'Invalid url'})
            if(!msg)
                return res.status(404).json({message:'Please enter a message.'})

            if (!mongoose.Types.ObjectId.isValid(id))
                return res.status(400).json({message:'Invalid user ID format'})

            const user = await UserModel.findById(id);
            if (!user)
                return res.status(404).json({message:'User not found...'})

    
       
            const newMsg = await MsgModel.create({ to: id, text: msg });

            return res.status(200).json({ message: 'success' });

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt === MAX_RETRIES) {
                return res.status(500).json({message:error.message});
            }

            // Optional: wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};


export const getMsg = async(req,res)=>{
    try {
    
        const id = req.user.id;
        if(!id) return res.status(400).json({message:'invalid url, no id found'})
        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const messages = await MsgModel.find({to:id});
        if(messages ){ 
        return res.status(200).json({message:messages})}
        res.status(404).json({message:'No message found'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

//when frined put myy sended url this will run to validate my id
export const sendMsg_urlValidator = async(req,res)=>{ 

    try {
        const id = req.query.id;
        if(!id) 
            return res.status(404).json({message:'Invalid url'})
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({message:'Invalid user ID format'})
        const user = await UserModel.findById(id);
        if(!user)
            return res.status(404).json({message:'User not found...'})

         res.status(200).json({
            time:remainTime(user),
            name:user.name,
        });
    } catch (error) {
        res.status(500).json({message:`${error.message}`});
        console.log(error);
    }
};


function remainTime(user){
    const createdAt = new Date(user.createdAt);
const now = new Date();

const msIn24Hours = 24 * 60 * 60 * 1000;
const timePassed = now - createdAt;
    return msIn24Hours - timePassed;
}