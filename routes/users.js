var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const passportJWT = require('../middleware/passportJWT')
const checkAdmin = require('../middleware/checkAdmin')

//get all user check admin
router.get('/',[passportJWT.isLogin,checkAdmin.isAdmin] ,userController.index);

router.get('/me',[passportJWT.isLogin],userController.getProfile);

//Insert User
router.post('/',[passportJWT.isLogin,checkAdmin.isAdmin,
    body('name').not().isEmpty().withMessage("กรุณากรอกชื่อ-สกุล"),
    body('email').not().isEmpty().withMessage("กรุณากรอกอีเมล").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่าน")
    .isLength({min:6}).withMessage("รหัสผ่านต้องมีค่ามากกว่า 6 ตัวอักษรขึ้นไป"),
], userController.register);

//Login 
router.post('/login',[
    body('email').not().isEmpty().withMessage("กรุณากรอกอีเมล").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่าน")
    .isLength({min:6}).withMessage("รหัสผ่านต้องมีค่ามากกว่า 6 ตัวอักษรขึ้นไป"),
],userController.login);

//get me
router.put('/me',[passportJWT.isLogin ,
    body('name').not().isEmpty().withMessage("กรุณากรอกชื่อ-สกุล"),
    body('email').not().isEmpty().withMessage("กรุณากรอกอีเมล").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่าน")
    .isLength({min:6}).withMessage("รหัสผ่านต้องมีค่ามากกว่า 6 ตัวอักษรขึ้นไป")],userController.profile)

//get user by id check admin
router.get('/:id',[passportJWT.isLogin,checkAdmin.isAdmin], userController.show);

//update by id check admin
router.put('/:id',
[passportJWT.isLogin,checkAdmin.isAdmin], userController.update);

//delete by id check admin
router.delete('/:id',[passportJWT.isLogin,checkAdmin.isAdmin], userController.drop);

module.exports = router;
