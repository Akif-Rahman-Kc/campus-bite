import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    order_id:{
        type:String,
        required:true,
        trim:true
    },
    student_id:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:String,
        required:true,
        trim:true,
        default:"PLACED"
    },
    student_name:{
        type:String,
        required: true,
        trim: true
    },
    student_mobile_no:{
        type:String,
        required: true,
        trim: true
    },
    cart_total:{
        type:String,
        required:true,
        trim:true
    },
    items:[{
        item_id:{
            type:String,
            required: true,
            trim: true
        },
        item_name:{
            type:String,
            required: true,
            trim: true
        },
        item_image:{
            type:String,
            required: true,
            trim: true
        },
        quantity:{
            type:String,
            required: true,
            trim: true
        },
        item_total_price:{
            type:String,
            required: true,
            trim: true
        }
    }],
    created_at:{
        required: true,
        type: Number,
        trim: true,
        default: Date.now()
    }
})

export default model('orders',orderSchema);