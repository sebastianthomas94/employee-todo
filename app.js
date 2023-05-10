const express= require("express");
const mongo=require("mongoose");
const app= express();
const path= require('path');
const bodyparser = require('body-parser');
const userData= require('./usersData');
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.set("view engine", "ejs");     
app.set("views"); 


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"styles")));
app.use(bodyparser.json());
app.use(session({
    secret: 'my-secret-key', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: false,

  }));
app.use((req, res, next) => {
    res.header('Cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0, post-check=0,pre-check=0');
    next();
});
app.use(cookieParser());

const url = "mongodb://localhost/SayItApp";

mongo.connect(url,function(err){
    if(err) 
    throw err;
    else
    console.log("database connected")
});

  let authData={
    username: true,
    password: true,
    user: ""
};

let userPointer;


app.get("/", function(req,res){

     
    console.log(userData);
    if(req.session.auth)
        res.redirect("/home");
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

app.get("/home", function(req,res){ 
    if(req.session.auth)
        res.render("home", userData[req.session.userPointer]);
    else
        res.redirect("/");
    
});

app.post("/UserAuth",(req, res) =>{


    for(let i in userData)
    {
        if(userData[i].username == req.body.username && userData[i].password == req.body.password)
        {
            req.session.auth= true;
            userPointer= i;
            req.session.userPointer= userPointer;
            res.redirect("/home");
            return;
        }
        else if(userData[i].username == req.body.username)
        {
            req.session.userPointer= i;
        }

    }

    if(req.session.userPointer)
    {
        authData.username= userData[req.session.userPointer].username == req.body.username;
        authData.password= userData[req.session.userPointer].password == req.body.password && authData.username;
    }
    else{
        authData.username= false;
        authData.password= false;
    }
    if (authData.username)
        authData.user= req.body.username;
    res.redirect("/");  
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

app.get("/register", function(req,res){
    if(req.session.auth)
        res.redirect("/home");
    else
        res.render("register",{name:""});
});

app.post("/newUser", function(req,res){
    for (let i in userData)
    {
        if(userData[i].username == req.body.username)
        {
            res.render("register", {message: "Username alredy exist! create another username.", name: req.body.name});
            return;
        }
    }
    userData.push(req.body);
    console.log(userData);
    req.session.auth= true;
    req.session.userPointer= userData.length-1;
    res.redirect("/home");
});


app.listen(8080,function(req,res){
    console.log("server is running at port 8080...");
});


