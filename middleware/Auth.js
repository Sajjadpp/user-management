const verifySession=(req,res,next)=>{

    if(req.session.user){
        console.log(req.session.user)
        next()

    }
    else{

        res.redirect("/login")
    }
}

const isLogin=(req,res,next)=>{

    if(req.session.user){

        res.redirect("/")
    }
    else{
        next()
    }
}

module.exports = {
    verifySession,
    isLogin
}