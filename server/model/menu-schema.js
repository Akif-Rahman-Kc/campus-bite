import { Schema, model } from 'mongoose';

const menuSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type: Number,
        required: true,
        trim: true
    },
    image:{
        type: Object,
        required: true,
        trim: true
    },
    status:{
        type: String,
        required: true,
        trim: true,
        default: "IN STOCK"
    },
    rating:{
        type: String,
        required: true,
        trim: true,
        default: 4.8
    },
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    },
})

export default model('menus',menuSchema);