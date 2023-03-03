var express = require('express');
const { route } = require('./cars');
var router = express.Router();

router.get('/', (req,res,next)=>{res.json({message:'Welcome to Project API'})});

module.exports = router;