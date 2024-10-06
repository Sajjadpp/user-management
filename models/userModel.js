const mongoose = require("mongoose");


let userSchema = new mongoose.Schema({

    userName:{ type: "string",required: true},
    mobileNo:{type: "string", required: true},
    email: {type: "string", required: true},
    password:{type: "string", required: true},
    isAdmin:{type: Boolean, default: false}
})

module.exports = mongoose.model("User",userSchema)