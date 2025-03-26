import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { canteenJWT } from '../middleware/auth.js';
import { canteenAuth, canteenLogin } from '../controller/auth.js';
import { studentList, studentPaymentDues } from '../controller/student.js';
import { menuCreate, menuDelete, menuDetails, menuList, menuStatusUpdate, menuUpdate } from '../controller/menu.js';
import { orderCreate, orderList, orderStatusUpdate } from '../controller/order.js';
import { notificationCreate } from '../controller/notification.js';

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
router.post('/login', canteenLogin)
router.post('/auth', canteenJWT, canteenAuth)

// Student
router.get('/student/list', canteenJWT, studentList)
router.get('/student/payment-dues', canteenJWT, studentPaymentDues)

// Menu
router.post('/menu/create', uploads.single('image'), canteenJWT, menuCreate)
router.get('/menu/details', canteenJWT, menuDetails)
router.get('/menu/list', canteenJWT, menuList)
router.patch('/menu/update', uploads.single('image'), canteenJWT, menuUpdate)
router.patch('/menu/update-status', canteenJWT, menuStatusUpdate)
router.delete('/menu/delete', canteenJWT, menuDelete)

// Order
router.get('/order/list', canteenJWT, orderList)
router.patch('/order/update-status', canteenJWT, orderStatusUpdate)

// Notification
router.post('/notification/create', canteenJWT, notificationCreate)

export default router;