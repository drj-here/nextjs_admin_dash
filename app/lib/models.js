import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        min:4,
        max:20
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true,
    },
    img:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    }
},{
    timestamps:true
});

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    desc:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','in-progress','completed'],
        default:'pending'
    },
    createdAt:{
        type:Date,
        default:Date.now 
    }
});

export const User=mongoose.model.User || mongoose.model('User',userSchema)
export const Task=mongoose.model.Task || mongoose.model('Task',taskSchema)