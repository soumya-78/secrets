require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

//express stuff
const app = express();
app.use(express.static("public"));

//ejs part
app.set('view engine', 'ejs');

//body parser stuff
app.use(bodyParser.urlencoded({ extended: true }));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/UserDB');
}
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// console.log(process.env.SECRET)
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


const User = mongoose.model('User', userSchema);


app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("secrets");
        }
    })
})
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function (err, findUser) {
        if (!err) {
            if (findUser) {
                if (findUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })

})













app.listen(3000, function () {
    console.log("Server started on port 3000");
});