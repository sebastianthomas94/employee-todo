const exp = require('express');
const router = exp.Router();
const user = require('../model/user');




router.get("/", function(req,res){
    if(req.session.auth)
        res.redirect("/home");
    else
        res.render("register",{name:""});
});

router.post("/newUser", function(req,res){ 
    const newUser= new user(req.body);
    if(req.body.admin == 'true')
        req.session.admin=true;
    else
        req.session.admin=false;
    newUser.save()
    .then(()=>{
        console.log("Data saved from route:",  req.body);
    })
    .catch((err)=>{
        console.log("error while saving data:", err);
    });
    req.session.auth= true;
    req.session.name= req.body.name;
    res.redirect("/home");
});


module.exports = router;