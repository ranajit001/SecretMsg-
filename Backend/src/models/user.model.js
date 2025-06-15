import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true });

// Auto-delete user after 24 hours
userSchema.index({ createdAt: 1 }, { expires: '24h' });

export const UserModel = mongoose.model('User', userSchema);


