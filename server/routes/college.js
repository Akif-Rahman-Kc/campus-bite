import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { collegeJWT } from '../middleware/auth.js';
import { collegeAuth, collegeLogin } from '../controller/auth.js';
import { studentDelete, studentList, studentPaymentDues, studentStatusUpdate, studentUpdate } from '../controller/student.js';
import { menuList } from '../controller/menu.js';
import { orderList } from '../controller/order.js';

///////////////// Multer /////////////////
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file!', false);
    }
};

const uploads = multer({ storage, fileFilter });
//////////////////////////////////////////

// Authentication
router.post('/login', collegeLogin)
router.post('/auth', collegeJWT, collegeAuth)

// Student
router.get('/student/list', collegeJWT, studentList)
router.patch('/student/update', collegeJWT, studentUpdate)
router.patch('/student/update-status', collegeJWT, studentStatusUpdate)
router.delete('/student/delete', collegeJWT, studentDelete)
router.get('/student/payment-dues', collegeJWT, studentPaymentDues)

// Menu
router.get('/menu/list', collegeJWT, menuList)

// Order
router.get('/order/list', collegeJWT, orderList)

export default router;