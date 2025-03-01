import Student from "../model/student-schema.js";
import Order from "../model/order-schema.js";

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

// export async function studentDetails(req, res) {
//     try {
//         const student = await Student.findById(req.query._id)
//         res.json({ status: "success", student })
//     } catch (error) {
//         res.json({ status: "failed", message: "Code error" })
//     }
// }

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