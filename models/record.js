const mongoose = require('mongoose')
const Schema = mongoose.Schema


const recSchema = new Schema({
    car: { type: Schema.Types.ObjectId, ref: 'Car' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
  }, { 
    toJSON: {virtuals: true},
    collection: "record",
    versionKey: false
});


const record = mongoose.model("Record", recSchema)

module.exports = record