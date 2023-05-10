var mongoose=require("mongoose");
var schema= mongoose.Schema;
var empschema=new schema({
    Eid:String,
    Name:String,
    Salary:Number
})

var empmodel=mongoose.model("employee", empschema);

module.exports=empmodel;