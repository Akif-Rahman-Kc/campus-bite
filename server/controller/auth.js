import { compare, hash } from "bcrypt";
import jwt from 'jsonwebtoken'
import Student from "../model/student-schema.js";
import Canteen from "../model/canteen-schema.js";
import College from "../model/college-schema.js";

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

export async function studentRegister(req, res) {
    try {
        const { student_id, username, mobile_no, age, gender, year, department, password, verify } = req.body
        if (student_id != "" && username != "" && mobile_no != "" && age != "" && gender != "" && year != "" && department != "" && password != "") {
            if (verify) {
                const exist_student = await Student.findOne({ student_id: student_id })
                if (exist_student) {
                    res.json({ status: "failed", message: "This student id already registered, please try login" })
                } else {
                    const fiftyYearsInSeconds = 50 * 365 * 24 * 60 * 60; // 50 years in seconds

                    const pwd = await hash(password, 10)
                    await Student.create({ student_id, username, mobile_no, age, gender, year, department, password: pwd })
                    const student = await Student.findOne({ student_id: student_id })
                    const studentId = student._id
                    const token = jwt.sign({ studentId }, process.env.JWT_SECRET_KEY, { expiresIn: fiftyYearsInSeconds })
                    res.json({ status: "success", auth: true, token: token })
                }
            } else {
                res.json({ status: "failed", message: "You didnt verify your phone number" })
            }
        } else {
            res.json({ status: "failed", message: "Please enter your all details" })
        }
    } catch (error) {
        console.log(error);
        
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentLogin(req, res) {
    try {
        const { student_id, password } = req.body
        const student = await Student.findOne({ student_id: student_id })
        if (student) {
            if (student.status === "INACTIVE") {
                res.json({ auth: false, status: "failed", blocked: true, message: "Your account is Blocked!. Please contact support team" })
            } else if (student.status === "PENDING") {
                res.json({ auth: false, status: "failed", blocked: true, message: "Your account in approval stage, Please wait for the approval" })
            } else {
                const isMatch = await compare(password, student.password)
                if (isMatch) {
                    const fiftyYearsInSeconds = 50 * 365 * 24 * 60 * 60; // 50 years in seconds
                    const studentId = student._id
                    const token = jwt.sign({ studentId }, process.env.JWT_SECRET_KEY, { expiresIn: fiftyYearsInSeconds })
                    res.json({ status: "success", auth: true, token: token })
                } else {
                    res.json({ status: "failed", auth: false, message: "Your password is incorrect" })
                }
            }
        } else {
            res.json({ status: "failed", auth: false, message: "Your student_id is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentAuth(req, res) {
    try {
        const student_details = await Student.findById(req.studentId)
        if (student_details) {
            if (student_details.status === "INACTIVE") {
                res.json({ auth: false, status: "failed", blocked: true, message: "Your account is Blocked!. Please contact support team" })
            } else if (student_details.status === "PENDING") {
                res.json({ auth: false, status: "failed", blocked: true, message: "Your account in approval stage, Please wait for the approval" })
            } else {
                res.json({ status: "success", auth: true, student_details: student_details })
            }
        } else {
            res.json({ status: "success", auth: false })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

//////////////////////////////////////////////////////  CANTEEN  //////////////////////////////////////////////////////

export async function canteenLogin(req, res) {
    try {
        // req.body.password = await hash(req.body.password, 10)
        // req.body.created_at = Date.now()
        // await Canteen.create(req.body)
        // res.json(true)

        const { username, password } = req.body
        const canteen = await Canteen.findOne({ username: username })
        if (canteen) {
            const isMatch = await compare(password, canteen.password)
            if (isMatch) {
                const canteenId = canteen._id
                const token = jwt.sign({ canteenId }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 })
                res.json({ status: "success", auth: true, token: token, })
            } else {
                res.json({ status: "failed", auth: false, type: "password", message: "Your password is incorrect" })
            }
        } else {
            res.json({ status: "failed", auth: false, type: "username", message: "Your username is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function canteenAuth(req, res) {
    try {
        const canteen_details = await Canteen.findById(req.canteenId)
        if (canteen_details) {
            res.json({ status: "success", auth: true })
        } else {
            res.json({ status: "success", auth: false })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

//////////////////////////////////////////////////////  COLLEGE  //////////////////////////////////////////////////////

export async function collegeLogin(req, res) {
    try {
        // req.body.password = await hash(req.body.password, 10)
        // req.body.created_at = Date.now()
        // await College.create(req.body)
        // res.json(true)

        const { username, password } = req.body
        const college = await College.findOne({ username: username })
        if (college) {
            const isMatch = await compare(password, college.password)
            if (isMatch) {
                const collegeId = college._id
                const token = jwt.sign({ collegeId }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 })
                res.json({ status: "success", auth: true, token: token })
            } else {
                res.json({ status: "failed", auth: false, type: "password", message: "Your password is incorrect" })
            }
        } else {
            res.json({ status: "failed", auth: false, type: "username", message: "Your username is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function collegeAuth(req, res) {
    try {
        const college_details = await College.findById(req.collegeId)
        if (college_details) {
            res.json({ status: "success", auth: true })
        } else {
            res.json({ status: "success", auth: false })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}