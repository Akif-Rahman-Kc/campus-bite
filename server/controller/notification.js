import Notification from "../model/notification-schema.js";
import Student from "../model/student-schema.js";

//////////////////////////////////////////////////////  NOTIFICATION  //////////////////////////////////////////////////////

export async function notificationCreate(req, res) {
    try {
        const { student_id, message, title } = req.body
        if (student_id && message && title) {
            const student = await Student.findById(student_id)
            if (student) {
                await Notification.create({ student_id, message, title })
                res.json({status:"success"})
            } else {
                res.json({status:"failed", message: "Student not exist, please try again or else call that student"})
            }
        } else {
            res.json({status:"failed", message: "Params not getting proper, plese back an try"})
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function notificationListByStudentId(req, res) {
    try {
        const notifications = await Notification.find({ student_id: req.query.student_id }).sort({ created_at:-1 })
        res.json({status:"success", notifications})
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function notificationStatusUpdate(req, res) {
    try {
        console.log("a");
        console.log(req.body);
        await Notification.updateMany({student_id: req.body.student_id},{
            $set:{
                status: "READ"
            }
        })
        res.json({status:"success"})
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}