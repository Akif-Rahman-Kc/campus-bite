import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
    student_id:{
        type:String,
        required:true,
        trim:true
    },
    message:{
        type: String,
        required: true,
        trim: true
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        required: true,
        trim: true,
        default: "UN_READ"
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    },
})

export default model('notifications',notificationSchema);