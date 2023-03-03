var express = require('express');
var router = express.Router();
const recordController = require('../controllers/recordController')
const { body } = require('express-validator')
const passportJWT = require('../middleware/passportJWT')
const checkAdmin = require('../middleware/checkAdmin')

router.get('/', [passportJWT.isLogin,checkAdmin.isAdmin],recordController.index);

//insert check admin
router.post('/',[passportJWT.isLogin,checkAdmin.isAdmin,
    body("car").not().isEmpty().withMessage("กรุณากรอกรหัสรถยนต์")
    .isLength({min:24,max:24}).withMessage("รหัสผ่านต้องมีค่า 24 ตัวอักษรเท่านั้น"),
    body("user").not().isEmpty().withMessage("กรุณากรอกรหัสผู้ซื้อ")
    .isLength({min:24,max:24}).withMessage("รหัสผ่านต้องมีค่า 24 ตัวอักษรเท่านั้น"),
    
    ], recordController.insert);

//delete by id check admin
router.delete('/:id',[passportJWT.isLogin,checkAdmin.isAdmin], recordController.drop);

//get by id
router.get('/:id',[passportJWT.isLogin,checkAdmin.isAdmin], recordController.show);

module.exports = router;