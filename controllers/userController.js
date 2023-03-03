const User = require("../models/user")
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/index')

exports.index = async(req, res, next) => {
  try{
      const user = await User.find().sort({_id:1})
  
      let getUser = [];

  await user.map((user) => {
    getUser = [...getUser,
      {
          id: user._id,
          role: user.role,
          name: user.name,
          email: user.email,
          password: user.password
      },
    ];
  });

  res.status(200).json({
    data: getUser,
  })
   } catch ( error ){
      next(error)
  }
}

exports.show = async(req, res, next) => {
  try{

      const { id } = req.params

      const user = await User.findOne({
          _id: id /*req.params.id*/
      })

      if(!user){
          const error = new Error("เกิดข้อผิดพลาด ไม่พบผู้ใช้งาน")
          error.statusCode = 400
          throw error;
      }
      
          const showUser = {
              id: user._id,
              role: user.role,
              name: user.name,
              email: user.email,
              password: user.password,
                 
          }
      
          res.status(200).json({
              data: showUser
          })
      
  } catch ( error ){
      next(error)
  }
}

  exports.register = async(req,res,next) => {
    try {
    const {name,email,password} = req.body

      //validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง")
        error.statusCode = 422 //validation use 422
        error.validation = errors.array()
        throw error;
      }

    const existEmail = await User.findOne({ email:email})

    if(existEmail){
      const error = new Error("อีเมลนี้มีผู้ใช้งานแล้ว")
      error.statusCode = 400
      throw error;
    }

    let user = new User();
    user.name = name
    user.email = email
    user.password = await user.encryptPassword(password)

    await user.save()
    res.status(201).json({
      message:"ลงทะเบียนเรียบร้อยแล้ว"
    })
    } catch (error) {
      next(error)
    }
  }

  exports.login = async (req,res,next) => {
    try {
      const {email,password} = req.body
      
      //validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง")
        error.statusCode = 422 //validation use 422
        error.validation = errors.array()
        throw error;
      }
      
      //check email isExist
      const user = await User.findOne({ email:email})

      if(!user){
      const error = new Error("ไม่พบผู้ใช้งาน")
      error.statusCode = 404 //404 user not found
      throw error;
      }
    
      const isValid = await user.checkPassword(password)
      if(!isValid){
        const error = new Error("รหัสผ่านไม่ถูกต้อง")
        error.statusCode = 401 //401 password incorrect
        throw error;
        }

      //creat token
      const token = await jwt.sign({
        id:user._id,
        role:user.role,
      },config.SECRETKEY //secret key
      ,{expiresIn:"5 days"})
      
      const expires_In = jwt.decode(token)

      res.status(200).json({
        access_token:token,
        expires_In: expires_In.exp,
        token_type:'Bearer'
      })
      
      } catch (error) {
        next(error)
      }
  }

  exports.update = async(req, res, next) => {

    try{

        const { id } = req.params
        const { role, name, password ,email} = req.body

        const existData = await User.findOne({ _id:id})

        if(!existData){
            const error = new Error("ไม่พบชื่อผู้ใช้งาน")
            error.statusCode = 400
            throw error;
        }

        let encrypt = new User();
        encrypt.password = await encrypt.encryptPassword(password)

        const user = await User.updateOne({ _id : id }, {
            role: role,
            name: name,
            email: email,
            password: encrypt.password,
        })
        
      
        res.status(200).json({
            message: ' แก้ไขข้อมูลผู้ใช้งานเรียบร้อย',
        })

    } catch ( error ){
        next(error)
    }
}

exports.drop = async(req, res, next) => {

  try{

      const { id } = req.params

      const user = await User.deleteOne({
          _id: id /*req.params.id*/
      })

      if (user.deletedCount === 0) {
          const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูลที่จะลบ")
          error.statusCode = 400
          throw error;
      }
      else{
          res.status(200).json({
              message: 'ลบข้อมูลผู้ใช้งานเรียบร้อย'
          })
      }

  } catch ( error ){
      next(error)
  }

}







  //jwt /me
  exports.profile = async (req, res, next) => {
    try{

      const { id } = req.user
      const { name, email, password } = req.body

      const existId = await User.findOne({ _id : id })
      
      const existEmail = await User.findOne({ email:email })

      const findUsersEmail = await User.findOne({ _id: id })

      if (!existId){
          const error = new Error("ไม่พบไอดีผู้ใช้")
          error.statusCode = 400
          throw error;
      }
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const error = new Error("ใส่ข้อมูลไม่ถูกต้อง")
          error.statusCode = 422;
          error.validation = errors.array()
          throw error;
      }
      
      if (existEmail&&findUsersEmail.email!=req.body.email){
          const error = new Error("อีเมลนี้ได้ถูกใช้ไปแล้ว")
          error.statusCode = 400
          throw error;
      }
      
      let encrypt = new User();
        encrypt.password = await encrypt.encryptPassword(password)

      const users = await User.updateOne({ _id : id }, {
          name: name,
          email: email,
          password: encrypt.password
      })

      res.status(200).json({
          message: name + ' แก้ไขข้อมูลเรียบร้อย'
      })

  } catch ( error ){
      next( error )
  }
  }


  exports.getProfile = (req, res, next) => {
    const {role,name,email } = req.user
    res.status(200).json({
      name:name,
      email:email,
      role:role
    })
  }
