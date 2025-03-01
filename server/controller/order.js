import Order from "../model/order-schema.js";
import Student from "../model/student-schema.js";

//////////////////////////////////////////////////////  ORDER  //////////////////////////////////////////////////////

export async function orderCreate(req, res) {
    try {
        const { cart, student_id, cart_total } = req.body
        if (cart && student_id) {
            const student = await Student.findOne({student_id: student_id})
            if (student) {
                const create_obj = {
                    order_id: "#" + Date.now() * Math.floor(Math.random() * 10),
                    student_id: student_id,
                    student_name: student.username,
                    student_mobile_no: student.mobile_no,
                    cart_total:cart_total,
                    items:cart
                }
                await Order.create(create_obj)
                await Student.updateOne({student_id:student_id},{
                    $set:{
                        cart: []
                    }
                })
                res.json({status:"success"})
            } else {
                res.json({status:"failed"})
            }
        } else {
            res.json({status:"failed"})
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function orderListByStudentId(req, res) {
    try {
        const orders = await Order.find({student_id:req.query.student_id}).sort({created_at:-1})
        res.json({status:"success", orders})
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function orderList(req, res) {
    try {
        const orders = await Order.find().sort({created_at:-1})
        res.json({status:"success", orders})
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function orderStatusUpdate(req, res) {
    try {
        await Order.updateOne({_id:req.body._id},{
            $set:{
                status: req.body.status
            }
        })
        res.json({status:"success"})
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function orderDelete(req, res) {
    try {
        await Order.deleteOne({_id:req.query._id})
        res.json({status:"success"})
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}