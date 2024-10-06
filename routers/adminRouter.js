const express = require("express");
const admin = express.Router();
const adminControllers = require("../controllers/adminControllers")
const adminAuth = require("../middleware/adminAuth");
// setting admin home page
admin.get("/",adminAuth.isLogin, adminControllers.loadHome);

admin.get("/login", adminAuth.isLogout, adminControllers.loadLogin); // for admin login

admin.post("/login", adminControllers.verifyAdmin); // for admin verification

admin.post("/search", adminControllers.searchUser); // searching the user

admin.get("/edit/:id", adminAuth.isLogin, adminControllers.editUser);   // for edit the user

admin.post("/saveEdit/:id", adminControllers.saveCganges); // saving the edited data

admin.get("/delete/:id", adminAuth.isLogin, adminControllers.deleteUser) // removing a user

admin.get("/createUser", adminAuth.isLogin, adminControllers.LoadcreateUser); // creating a user page 

admin.post("/createUser", adminControllers.createUser); // post of create-user

admin.get("/logout", adminControllers.adminLogout);  // logouting a user by clearing a session

module.exports = admin