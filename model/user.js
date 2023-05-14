var mongoose=require("mongoose");
var schema= mongoose.Schema;
var userschema=new schema({

    name:String,
    username:String,
    password:String,
    admin: Boolean
});

var usermodel=mongoose.model("user", userschema);

module.exports=usermodel;