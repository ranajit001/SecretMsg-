import { MsgModel } from "../models/msg.model.js";
import { UserModel } from "../models/user.model.js";
import mongoose from "mongoose";

import { timeRemain } from "./user.controller.js";
import { createdAt_to_dateAndTime } from "./user.controller.js";

export const sendMsg = async (req, res) => {

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) { 
        try { 
            const id = req.params.id;
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

export const getMsg = async(req,res)=>{  console.log('coming to getmsg');

    try {
    
        const id = req.user.id;
        if(!id)
             return res.status(400).json({message:'invalid url, no id found'});

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ message: 'Invalid user ID' });
        
        const messages = await MsgModel.find({to:id});

        if(messages )
            return res.status(200).json({message:messages})

        res.status(404).json({message:'No message found'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};






//when frined put myy sended url this will run to validate my id
export const sendMsg_urlValidator = async(req,res)=>{ //console.log(`comming to validate url`);
    try {
        const id = req.params.id;
        if(!id) 
            return res.status(404).json({message:'Invalid url'})
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({message:'Invalid user ID format'})
        const user = await UserModel.findById(id);
        if(!user)
            return res.status(404).json({message:'User not found...'})

         res.status(200).json({
            validTill:createdAt_to_dateAndTime(user.createdAt),
            name:user.name,
        });
    } catch (error) {
        res.status(500).json({message:`${error.message}`});
        console.log(error);
    }
};


