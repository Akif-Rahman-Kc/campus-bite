import Student from "../model/student-schema.js";
import Order from "../model/order-schema.js";
import Menu from "../model/menu-schema.js";

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

export async function studentDetails(req, res) {
    try {
        console.log(req.query);
        const student = await Student.findById(req.query._id)
        res.json({ status: "success", student })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentList(req, res) {
    try {
        const students = await Student.find().sort({ created_at: -1 })
        res.json({ status: "success", students })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentUpdate(req, res) {
    try {
        const student = await Student.findById(req.body._id)
        if (student) {
            await Student.updateOne({ _id: req.body._id }, {
                $set: {
                    username: req.body.username ? req.body.username : student.username,
                    mobile_no: req.body.mobile_no ? req.body.mobile_no : student.mobile_no,
                    age: req.body.age ? req.body.age : student.age,
                    gender: req.body.gender ? req.body.gender : student.gender,
                    year: req.body.year ? req.body.year : student.year,
                    department: req.body.department ? req.body.department : student.department
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentStatusUpdate(req, res) {
    try {
        const student = await Student.findById(req.body._id)
        if (student) {
            await Student.updateOne({ _id: req.body._id }, {
                $set: {
                    status: req.body.status
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentDelete(req, res) {
    try {
        const student = await Student.findById(req.query._id)
        if (student) {
            await Student.deleteOne({ _id: req.query._id })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentPaymentDues(req, res) {
    try {
        const due_orders = []
        const students = await Student.find()
        for (const student of students) {
            const payment_pending_orders = await Order.find({ status: "PAYMENT PENDING", student_id: student.student_id })
            if (payment_pending_orders && payment_pending_orders.length > 0) {
                const total_amount = payment_pending_orders.reduce((sum, item) => sum + item.cart_total, 0);
                const data = {
                    "student_id": student.student_id,
                    "name": student?.username,
                    "mobile_no": student?.mobile_no,
                    "due_amount": total_amount,
                    "due_orders": payment_pending_orders,
                    "due_start_date": payment_pending_orders[0]?.created_at, // This means array first data date, that is the start date
                }
                due_orders.push(data)
            }
        }
        res.json({ status: "success", due_orders })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

///////////// CART //////////////

export async function createStudentCart(req, res) {
    try {
        const student = await Student.findById(req.body._id)
        let cart
        for (const obj of student.cart) {
            if (obj.item_id.toString() === req.body.item_id.toString()) {
                cart = obj
                break;
            }
        }
        
        if (cart) {
            if (cart.quantity <= 1 && req.body.count == -1) {
                await Student.updateOne({_id: req.body._id},{
                    $pull:{
                        cart:{
                            item_id:req.body.item_id,
                        }
                    }
                })
            } else {
                await Student.updateOne({_id:req.body._id, "cart.item_id": req.body.item_id},{
                    $set:{
                        "cart.$.quantity": req.body.count == 1 ? cart.quantity + 1 : cart.quantity - 1,
                        "cart.$.item_total_price": req.body.count == 1 ? cart.item_total_price + req.body.item_price : cart.item_total_price - req.body.item_price
                    }
                })
            }
        } else {
            await Student.updateOne({_id :req.body._id},{
                $push:{
                    cart:{
                        item_id:req.body.item_id,
                        item_name:req.body.item_name,
                        item_image:req.body.item_image,
                        item_total_price:req.body.item_price,
                        quantity:1
                    }
                }
            })
        }
        res.json({ status: "success" })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function deleteStudentCart(req, res) {
    try {
        await Student.updateOne({_id:req.query._id},{
            $pull:{
                cart:{
                    _id:req.query.cart_id,
                }
            }
        })
        res.json({ status: "success" })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function checkStockCart(req, res) {
    try {
        const student = await Student.findById(req.query._id)
        for (const obj of student.cart) {
            const menu = await Menu.findOne({ _id: obj.item_id, status: "OUT_STOCK" })
            if (menu) {
                res.json({status:"success", no_stock_item: menu.name})
                break
            }
        }
        res.json({status:"success" })
    } catch (error) {
        res.json(false)
    }
}