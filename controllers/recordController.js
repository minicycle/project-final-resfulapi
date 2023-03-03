const Record = require('../models/record')
const Car = require('../models/car')
const { validationResult } = require('express-validator')


exports.index = async(req, res, next) => {

    try{
        //populate 2 table
        const record = await Record.find().populate('user').populate('car')

        let getCar = [];

            await record.map((record) => {
                getCar = [...getCar,
                {
                    Record_id: record._id,
                    User_name: record.user.name,
                    Car_Id: record.car._id, 
                    Car_name: record.car.name,
                    Purchase_date: record.created
                },
              ];
            });

           

    res.status(200).json({
      Record_Info: getCar,
    })
     } catch ( error ){
        next(error)
    }
}

exports.show = async(req, res, next) => {

    try{

        const { id } = req.params
        
        const record = await Record.findOne({
            _id: id /*req.params.id*/
        }).populate('user').populate('car')

        if(!record){
            const error = new Error("ไม่พบ Record")
            error.statusCode = 400
            throw error;
        }
        
            const showRecord = {
                Record_id: record._id,
                User_name: record.user.name,
                Car_Id: record.car._id, 
                Car_name: record.car.name,
                Purchase_date: record.created           
            }
        
            res.status(200).json({
                data: showRecord
            })
        
    } catch ( error ){
        next(error)
    }
}


exports.insert = async(req, res, next) => {
    try {
        const {car,user} = req.body
    
          //validation
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง")
            error.statusCode = 422 //validation use 422
            error.validation = errors.array()
            throw error;
          }

          const existObject = await Record.findOne({ car:car})

            if(existObject){
                const error = new Error("ไม่สามารถเพิ่มข้อมูลซ้ำได้")
                error.statusCode = 400
                throw error;
            }
            
            
            // const existCar = await Car.findOne({ car:car})
            
            // if(!existCar){
            //   const error = new Error("โปรดใส่รหัสรถให้ตรงตามในฐานข้อมูลที่มีอยู่เท่านั้น")
            //   error.statusCode = 404
            //   throw error;
            // }
  
    
          let record = new Record({
                car: car,
                user: user,
                
        });

        await record.save()
        res.status(200).json({
            message: 'เพิ่มข้อมูล Record เรียบร้อย',
        })
        } catch (error) {
          next(error)
        }
    
}

exports.drop = async(req, res, next) => {

    try{

        const { id } = req.params

        const record = await Record.deleteOne({
            _id: id /*req.params.id*/
        })

        if (record.deletedCount === 0) {
            const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูลที่จะลบ")
            error.statusCode = 400
            throw error;
        }
        else{
            res.status(200).json({
                message: 'Record ถูกลบเรียบร้อย'
            })
        }

    } catch ( error ){
        next(error)
    }

}

