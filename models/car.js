const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carSchema = new Schema({
    name:{type:String, require:true, trim:true},
    brand:{type:String, require:true, trim:true},
    price: { type: Number},
    category:{type:String, require:true, trim:true},
    status:{type:String,default:'Stock'},
    description:{type:String, require:true, trim:true},
    created: { type: Date, default: Date.now },

  }, { 
    toJSON: {virtuals: true},
    collection: "cars",
    versionKey: false
});

carSchema.virtual('price_vat').get(function(){
    return (this.price*0.07) + this.price
})

const car = mongoose.model("Car", carSchema)

module.exports = car