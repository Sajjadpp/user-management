const express = require("express");
const user = express.Router();
const userControllers = require("../controllers/userControllers") // importing the user controllers
const Auth = require("../middleware/Auth")

user.get("/", Auth.verifySession, userControllers.loadHome) // loading the home page

user.get("/login", Auth.isLogin, userControllers.loadLogin) // loading the login page

user.get("/signup", Auth.isLogin, userControllers.loadSignup) // loading the signup page

user.post("/signup", userControllers.verifySignup); // verifying the signup and creating the session

user.post("/login",userControllers.verifyLogin) // verifying the login page is user is or not

user.get("/logout", userControllers.logout) // lougout by clearing the session

user.get("/forgetPassword", userControllers.LoadforgetPassword) //  loading forget password page

user.post("/forgetPassword", userControllers.forgetVerification) // verification

user.get("/changePassword/:email",userControllers.LoadChangePassword) // load change password form 

user.post('/changePassword',userControllers.changePassword) // 



module.exports = user