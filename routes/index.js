var express = require('express');
const { route } = require('./cars');
var router = express.Router();

router.get('/', (req,res,next)=>{res.json({message:'Thanarat Pongjan'})});

module.exports = router;