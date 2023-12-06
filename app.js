//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1/userDB");

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});


app.listen(3000, function () {
    console.log('May chu dang chay o cong 3000');
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.render("secrets")
        });
});

app.post("/login", function (req, res) {
    User.findOne({ email: req.body.username })
        .then((docs) => {
            if (docs.password === req.body.password) {
                res.render("secrets");
            }
        });
})