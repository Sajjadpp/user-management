const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")

const loadLogin=(req,res)=>{

    res.render("admins/login")
}

const loadHome=async(req,res)=>{

   try{

    const userData = await User.find({isAdmin: false});
    res.render("admins/home",{userData})
   }
   catch(error){

    console.log(error.message)
   }
}

const verifyAdmin=(req,res)=>{

    try{
        
        let adminData = req.body;

        User.findOne({email: adminData.email, isAdmin: true}).exec()
        .then(async(admin)=>{

            if(admin){
                console.log(admin)
                let passwordMatch = await bcrypt.compare(adminData.password, admin.password);
                if(passwordMatch){

                    req.session.admin = admin._id;
                    res.json({status: true, message: "loggin successfull!!"})
                }
                else{

                    res.json({status: false, message: "pasword not match"})
                }
            }
            else{

                res.json({status: false, message: "admin not exist"})
            }
        })
    }
    catch(error){

        console.log(error.message)
    }
    
}


const searchUser = async(req,res)=>{
    
    try{
        if(req.body.search === ""){
            console.log("workin")
            let userData  = await User.find({isAdmin:false})
            console.log(userData)
            res.json({status:true, message: userData})
        }
        else{
    
            let regExp = new RegExp(`^${req.body.search}`,'i')
            let userData  = await User.find({userName: regExp,isAdmin:false})
            res.json({status:true, message: userData})
        }
    }
    catch(error){

        console.log(error.message)
    }
    
}

// editing the userData

const editUser = async(req,res)=>{

    try{
        let user = await User.findById(req.params.id);
        res.render("admins/edit",{user});
    }
    catch(err){

        console.log(err.message)
    }
}

const saveCganges=(req,res)=>{

    let userId = new mongoose.Types.ObjectId(req.params.id)

    try{

        User.findByIdAndUpdate(userId,{$set:{
            userName:req.body.userName,
            email: req.body.email,
            mobileNo: req.body.mobileNo
        }})
        .then((user)=>{

            res.redirect("/admin");
        })
    }
    catch(err){

        console.log(err.message)
    }
}

const deleteUser = (req,res)=>{

    try{
        let userId = new mongoose.Types.ObjectId(req.params.id);
        User.deleteOne({_id: userId})
        .then(()=>{

            res.redirect("/admin")
        })
    }
    catch(error){
        
        console.log(error.message)
    }
}

const LoadcreateUser=(req,res)=>{

    res.render("admins/createUser")
}

const createUser=async(req,res)=>{

    try{
        let email = req.body.email
    
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

        console.log("er")
    }
}

const adminLogout=(req,res)=>{

    req.session.destroy();
    res.redirect("/admin/login")
}

module.exports = {

    loadLogin,
    verifyAdmin,
    loadHome,
    searchUser,
    editUser,
    saveCganges,
    deleteUser,
    LoadcreateUser,
    createUser,
    adminLogout
}