const Car = require('../models/car')
const { validationResult } = require('express-validator')



exports.index = async(req, res, next) => {
    try{

        const car = await Car.find().sort({_id:1})
        
        let getCar = [];

    await car.map((car) => {
        getCar = [...getCar,
        {
            id: car._id,
            name: car.name,
            brand: car.brand,
            price: car.price,
            category: car.category,
            status: car.status,
            price_vat: car.price_vat, 
            description: car.description, 
        },
      ];
    });

    res.status(200).json({
      data: getCar,
    })
     } catch ( error ){
        next(error)
    }
}

exports.show = async(req, res, next) => {

    try{

        const { id } = req.params

        const car = await Car.findOne({
            _id: id /*req.params.id*/
        })

        if(!car){
            const error = new Error("เกิดข้อผิดพลาด ไม่พบรถยนต์")
            error.statusCode = 400
            throw error;
        }
        
            const showCar = {
                id: car._id,
                name: car.name,
                brand: car.brand,
                price: car.price,
                category: car.category,
                status: car.status,
                price_vat: car.price_vat, 
                description: car.description,            
            }
        
            res.status(200).json({
                data: showCar
            })
        
    } catch ( error ){
        next(error)
    }
}

exports.insert = async(req, res, next) => {
    try {
        const {name, brand, price ,category,description} = req.body
    
          //validation
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง")
            error.statusCode = 422 //validation use 422
            error.validation = errors.array()
            throw error;
          }

          let car = new Car({
                name: name,
                brand: brand,
                price: price,
                category: category,
                description: description, 
        });

        await car.save()
        res.status(200).json({
            message: name + ' เพิ่มข้อมูลเรียบร้อย',
        })
        } catch (error) {
          next(error)
        }
    
}

exports.update = async(req, res, next) => {

    try{

        const { id } = req.params
        const { name, brand, price ,category,status,description } = req.body

        const existData = await Car.findOne({ _id:id})

        if(!existData){
            const error = new Error("ไม่พบข้อมูลสำหรับการแก้ไข")
            error.statusCode = 400
            throw error;
        }

        const car = await Car.updateOne({ _id : id }, {
            name: name,
            brand: brand,
            price: price,
            category: category,
            status: status,
            description: description,
        })

        res.status(200).json({
            message: name + ' แก้ไขข้อมูลเรียบร้อย',
        })

    } catch ( error ){
        next(error)
    }
}

exports.statusupdate = async(req, res, next) => {

    try{

        const { id } = req.params
        const { status } = req.body

        const existData = await Car.findOne({ _id:id})

        if(!existData){
            const error = new Error("ไม่พบข้อมูลสำหรับการแก้ไข")
            error.statusCode = 400
            throw error;
        }

        const car = await Car.updateOne({ _id : id }, {
            status: status,
        })

        res.status(200).json({
            message: 'แก้ไขสถานะการสั่งซื้อเรียบร้อย',
        })

    } catch ( error ){
        next(error)
    }
}


exports.drop = async(req, res, next) => {

    try{

        const { id } = req.params

        const car = await Car.deleteOne({
            _id: id /*req.params.id*/
        })

        if (car.deletedCount === 0) {
            //throw new Error(' can\'t delete data / company data not found')
            const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูลที่จะลบ")
            error.statusCode = 400
            throw error;
        }
        else{
            res.status(200).json({
                message: 'ลบข้อมูลเรียบร้อย'
            })
        }

    } catch ( error ){
        next(error)
    }

}