import mongoose from 'mongoose';
import { config } from 'dotenv';
config()

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.mongouri)
    } catch (error) {
        console.log(error);    
    }
};
