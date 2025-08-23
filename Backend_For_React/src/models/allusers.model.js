import mongoose from 'mongoose';

const allUserSchema = new mongoose.Schema({name:String})
export const allUserModel = mongoose.model('allUser',allUserSchema)