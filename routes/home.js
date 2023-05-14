const exp = require('express');
const router = exp.Router();
const user = require('../model/user');


router.get("/", function(req,res){ 
    if(req.session.auth)
    {
        if(req.session.admin)
            res.redirect("/admin");
        else
            res.render('home', {name:req.session.name});
    }
    else
        res.redirect("/");
    
});





module.exports = router;