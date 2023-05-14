const exp = require('express');
const router = exp.Router();
const user = require('../model/user');


router.get("/", (req, res)=>{
    user.find({})
        .then((result)=>{ 
            res.render("admin",{admin: req.session.name, users:result});
        })
        .catch((err)=> 
        {   
            console.log(err);
        });
    
});

router.get("/deleteuser/:id", (req,res)=>{
    user.deleteOne({username: req.params.id})
    .then((result)=>{
        console.log("deleted:",result);
        res.redirect("/admin");
    })
    .catch((err)=>{
        console.log(err);
    });
});




module.exports = router;