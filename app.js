const express = require("express"); // requiring express
const app = express(); // creating instance for express 
const hbs = require("ejs"); // requiring ejs as engine
const db = require("./config/connection"); // requiring database for connection 
const session = require("express-session"); // requiring express-session
const nocache = require("nocache") // requiring nocache
const MongoStore = require("connect-mongo") // requiring mongo-store to connect session with mongodb
const dotenv = require("dotenv").config() // requiring .env 


// creating session
app.use(session({

    secret: "key",
    resave: false,
    store: MongoStore.create({ mongoUrl: `${process.env.MONGODB_URL}`}), // connecting to mongodb to store the session
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*24,secure: false}   
}))


//using nocache for removing cache
app.use(nocache())

db() // connecting to mongodb

// setting ejs as view engine and public folders
app.set("view engine","ejs");
app.use(express.static("public"))

// for passing the data to the server side (req.body)
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// requiring router pages
const userRouter = require("./routers/userRouter")
const adminRouter = require("./routers/adminRouter");




app.use("/", userRouter); // setting userRouter
app.use("/admin", adminRouter); // setting adminRouter


app.listen(process.env.PORT,()=>{

    console.log("connected to port 3000")
})