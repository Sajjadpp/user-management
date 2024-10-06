const mongoose = require("mongoose");

const connect = ()=>{

    try{
        
        mongoose.connect(`${process.env.MONGODB_URL}`);
    }
    catch(err){
        console.log("err")
    }
}

module.exports = connect;