var express = require('express');
var router = express.Router();
const carController = require('../controllers/carController')
const { body } = require('express-validator')
const passportJWT = require('../middleware/passportJWT')
const checkAdmin = require('../middleware/checkAdmin')

//get all 
router.get('/', carController.index);

//insert check admin
router.post('/',[passportJWT.isLogin,checkAdmin.isAdmin,
body("name").not().isEmpty().withMessage("กรุณากรอกชื่อรถยนต์"),
body("brand").not().isEmpty().withMessage("กรุณากรอกชื่อแบรนด์"),
body("price").not().isEmpty().withMessage("กรุณากรอกราคา"),
body("category").not().isEmpty().withMessage("กรุณากรอกประเภทรถยนต์"),
], carController.insert);


//update status check admin
router.put('/status/:id',
[passportJWT.isLogin,checkAdmin.isAdmin], carController.statusupdate);

//update check admin
router.put('/:id',
[passportJWT.isLogin,checkAdmin.isAdmin], carController.update);



//get by id
router.get('/:id', carController.show);

//delete by id check admin
router.delete('/:id',[passportJWT.isLogin,checkAdmin.isAdmin], carController.drop);

module.exports = router;