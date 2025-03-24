import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { studentJWT } from '../middleware/auth.js';
import { studentAuth, studentLogin, studentRegister } from '../controller/auth.js';
import { orderCreate, orderListByStudentId, orderPayment } from '../controller/order.js';
import { menuList } from '../controller/menu.js';
import { checkStockCart, createStudentCart, deleteStudentCart, studentDetails } from '../controller/student.js';

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
router.post('/register', studentRegister)
router.post('/login', studentLogin)
router.post('/auth', studentJWT, studentAuth)

// Student
router.get('/student/details', studentJWT, studentDetails)
router.post('/student/cart/create', studentJWT, createStudentCart)
router.delete('/student/cart/delete', studentJWT, deleteStudentCart)
router.get('/student/cart/stock-check', studentJWT, checkStockCart)

// Order
router.post('/order/create', studentJWT, orderCreate)
router.get('/order/list', studentJWT, orderListByStudentId)
router.post('/order/payment', studentJWT, orderPayment)

// Menu
router.get('/menu/list', studentJWT, menuList)

export default router;