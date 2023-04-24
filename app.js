require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const exp = require("constants");
const mongoose = require("mongoose");
const mongooseEncryption = require("mongoose-encryption");
const md5 = require("md5");


const secret = process.env.SECRET;

mongoose.connect("mongodb://0.0.0.0:27017/userDB")
    .then(console.log("Connected to DB"))

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(mongooseEncryption, {secret : secret , encryptedFields : ["password"]});

const User = mongoose.model("User", userSchema)


app.route("/")

    .get( (req, res) => {
        res.render("home");
    })


app.route("/register")

    .get( (req, res) => {
        res.render("register");
    })

    .post( (req, res) => {
        const newUser = User({
            email: req.body.username,
            password: md5(req.body.password)
        });
        newUser.save()
            .then(console.log("New User Added"), res.render("secrets"))
            .catch((err) => {console.log("Error in Registration: " + err)});
        })
        
        
app.route("/login")

    .get( (req, res) => {
        res.render("login");
    })
    
    .post( (req, res) => {
        const username = req.body.username;
        const password = md5(req.body.password);
        User.findOne({email: username})
            .then( (user) => {
                // console.log(user.password);
                // console.log(password);
                if (user.password == password) {
                    console.log(user)
                    res.render("secrets")
                }
            } )
        .catch((err) => {console.log("Error in Logging in: " + err)});
    })


app.listen(3000, () => {
    console.log("Server Running @ Port 3000");
})