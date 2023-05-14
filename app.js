const express= require("express");
const mongo=require("mongoose");
const app= express();
const path= require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const user = require('./model/user');
const register = require("./routes/register");
const home = require("./routes/home");
const admin = require("./routes/admin");


app.set("view engine", "ejs");     
app.set("views"); 


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"styles")));
app.use(bodyparser.json());
app.use(session({
    secret: 'my-secret-key', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: false
  }));
app.use((req, res, next) => {
    res.header('Cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0, post-check=0,pre-check=0');
    next();
});
app.use(cookieParser());
app.use("/register", register);
app.use("/home", home);
app.use("/admin", admin);

const url = "mongodb://127.0.0.1:27017/Todo-employee";

 mongo.connect(url)
 .then(() => console.log('Database connected'))
 .catch((err) => console.error(err)); 

  let authData={
    username: true,
    password: true,
    user: ""
};

let userPointer;


app.get("/", function(req,res){
    if(req.session.auth)
    {   
        if(req.session.admin)
            res.redirect("/admin");
        else
            res.redirect('/home');
    }
    else
    {
        res.render("login", authData);
        authData={
            username: true,
            password: true,
            user: ""
        };
    }
});



app.post("/UserAuth",(req, res) =>{

    user.find({username: req.body.username, password: req.body.password})
        .then((result)=>{ 
            req.session.auth= true;
            req.session.name=result[0].name;
            console.log("result data from user auth",result[0].name);
            if(result[0].admin)
            {   
                req.session.admin= true;
                res.redirect('/admin')
            }
            else
                res.redirect('/home')
        })
        .catch((err)=> 
        {   
            authData.username= false
            req.session.auth= false;
            authData.password= false;
            authData.user=req.body.user;
            res.redirect("/");
        });



});


app.get("/logout", function(req,res){
    req.session.destroy( (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
    userPointer=null;

});




app.listen(8080,function(req,res){
    console.log("server is running at port 8080...");
});


