require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,resp){
  resp.render("home");
});

app.get("/register",function(req,resp){
  resp.render("register");
});

app.get("/login",function(req,resp){
  resp.render("login");
});

app.post("/register",function(req,resp){
  const newUser = User ({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save(function(err){
    if(err){
    console.log(err);
    }else{
      resp.render("secrets");
    }
  });
});

app.post("/login",function(req,resp){

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          resp.render("secrets")
        }
      }
    }
  });
});






app.listen(3000, function(){
  console.log("Server started on port 3000");
});
