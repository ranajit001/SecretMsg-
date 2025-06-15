import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    // name:{
    //     type:String,
    //     trim:true,
    //     required: true},
    to:{
        type:mongoose.Types.ObjectId,
        ref:'User',
    },
   text:{
    type:String,
    trim:true,
    required: true}
});


// In your msg.model.js
messageSchema.index({ to: 1 });


export const MsgModel = mongoose.model('Msg',messageSchema);
