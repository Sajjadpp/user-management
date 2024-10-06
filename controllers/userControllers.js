const User =require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")



const loadLogin = (req,res)=>{
    
    res.render("users/login",{msg: req.session.body})
    req.session.msg = null
}

const loadSignup = (req,res)=>{
    res.render("users/signup")
}

const loadHome = (req,res)=>{
    res.render("users/home")
}

const verifySignup =async(req,res)=>{
    let email = req.body.email
    
    try{
        
        let userExist = await User.findOne({email:email}).exec()
        if(userExist){

            res.json({status: false, message:"user Exist"})
            
        }
        else{

            let password = await bcrypt.hash(req.body.password, 10);
            delete req.body.password
            const user = new User({...req.body, password})
            user.save()
            req.session.user = {...req.body, _id:user._id}
            res.json({status: true, message: "signup successfull!!"})
            
        }
    }
    catch(error){

        res.json({status: false, message: error.message})
    }
    

    
}


const verifyLogin=async(req,res)=>{
    try{

        
        let userExist = await User.findOne({email:req.body.email, isAdmin: false}).exec();

        if(userExist){
            
            await bcrypt.compare(req.body.password,userExist.password).then((response)=>{

                console.log(response)
                if(response){
                    
                    req.session.user = {
                        userName: userExist.userName,
                        mobileNo: userExist.mobileNo,
                        email: userExist.email ,
                        _id: userExist._id
                    }
                    res.json({status: true, message:"user logged successfull!!"})
                }
                else{

                    res.json({status: false, message:"password doesnt match"})
                }
            })
        }
        else{
            res.json({status: false, message: "user doesnt exist"})
        }   
    }
    catch(error){

        console.log("error", error.message)
        res.json({status: false, message: error.message})
    }
}


const logout =(req,res)=>{

    req.session.destroy();
    res.redirect("/")
}

const LoadforgetPassword =(req,res)=>{
    
    res.render("users/forgetPassword",)
    
}

const forgetVerification=async(req,res)=>{

    try{

        const email = req.body.email
        console.log(email)
        let userExist = await User.findOne({email:email})
        if(userExist){

        
            console.log(email)
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "sajjadmuhammed227@gmail.com",
                    pass: process.env.GOOGLE_PASS_KEY,
                },
            });  
            
            const info = await transporter.sendMail({

                from: "sajjadmuhammed227@gmail.com",
                to: email,
                subject: "Password change",
                text: "you can change password by clicking the link and reset the password \n", 
                html: `<p><a href='http://192.168.1.11:3000/changePassword/${userExist._id}'> change password</a></p>`, 
            },(err,info)=>{

                if(err){
                    console.log("trans err",err.message)
                    return
                }
                console.log("message sent: ",info);
                
                res.json({message: "message sent successfull !! please check the mail"})
            })
        }else{
            
            res.json({message: "user doesnt exist"})
        }
    }
    catch(error){

        console.log("error", error.message)
        res.json({message: error.message})
    }
    
}

const LoadChangePassword=(req,res)=>{

    res.render("users/changePassword",{email:req.params.email});
}

//  post of changing password 
const changePassword=async(req,res)=>{

    try{
        const id = req.body.email; // email requiring from body
        console.log(id)
        let hashedPassword = await bcrypt.hash(req.body.password,10) // hashing password by using bcrypt
        let user = await User.findOneAndUpdate({_id: id},{password:hashedPassword}); // update the password of the user
        if(user){
            res.json({status: true, message: "password Changed"})
        }
        else{

            res.json({status: false,message: "cant created in this time"})
        }
            // sending response to the user as password changed
        
    }
    catch(err){
        res.json({status: false, message:err.message}) // sending the error
    }
}

module.exports = {
    loadLogin,
    loadSignup,
    loadHome,
    verifySignup,
    verifyLogin,
    logout,
    LoadforgetPassword,
    forgetVerification,
    LoadChangePassword,
    changePassword
}

