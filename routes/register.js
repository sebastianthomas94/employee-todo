const exp = require('express');
const router = exp.Router();
const mongoose = require("mongoose");
const user = require('../model/user');
const bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({extended:true}));
router.use(bodyparser.json());

router.post("/",(req,res)=>{
    var u1 = new user(req.body);
    u1.save((err)=>{
        if (err) throw err;
        else res.send({msg:"User Created"});
    })
})

