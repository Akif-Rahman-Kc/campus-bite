import Order from "../model/order-schema.js";
import Student from "../model/student-schema.js";

//////////////////////////////////////////////////////  ORDER  //////////////////////////////////////////////////////

export async function orderCreate(req, res) {
    try {
        const { cart, _id, cart_total } = req.body
        if (cart && _id) {
            const student = await Student.findById(_id)
            if (student) {
                const create_obj = {
                    order_id: "#" + Date.now() * Math.floor(Math.random() * 10),
                    student_id: student.student_id,
                    student_name: student.username,
                    student_mobile_no: student.mobile_no,
                    cart_total:cart_total,
                    items:cart
                }
                await Order.create(create_obj)
                await Student.updateOne({_id:_id},{
                    $set:{
                        cart: []
                    }
                })
                res.json({status:"success"})
            } else {
                res.json({status:"failed", message: "Student not exist, please back and try"})
            }
        } else {
            res.json({status:"failed", message: "Params not getting proper, plese back an try"})
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

export async function orderPayment(req, res) {
    try {
        await Order.updateOne({_id:req.body._id},{
            $set:{
                status: "COMPLETED"
            }
        })
        res.json({status:"success"})
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}