const mongoose = require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose=require("passport-local-mongoose");

let stockSchema= new Schema({
    name: String,
    variety: String,
    quantity: Number,
    threshold: Number,
    price: Number,
    note: String,
    lifeSpan: Number,
},
{
    timestamps:true
});

module.exports=mongoose.model("Stock",stockSchema)