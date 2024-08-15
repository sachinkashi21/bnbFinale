const mongoose = require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose=require("passport-local-mongoose");

let toolSchema= new Schema({
    name: String,
    resource:[{
        type: String,
    }],
    uses: String,
    price: Number,
},
{
    timestamps:true
});

module.exports=mongoose.model("Tool",toolSchema)