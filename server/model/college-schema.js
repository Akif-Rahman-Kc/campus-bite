import { Schema, model } from 'mongoose';

const collegeSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    created_at:{
        required: true,
        type: Number,
        trim: true
    },
})

export default model('colleges',collegeSchema);