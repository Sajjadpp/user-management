const form = document.getElementById("form");
const loader = document.getElementById("loader")

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const userName = document.getElementById("username").value;
    const mobileNo = document.getElementById("phoneNo").value.trim();
    const email = document.getElementById("mail").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const result = document.getElementById("result");

    let isValid = true;

    result.innerHTML = ""

    if(userName.length < 3 || userName.length > 15){
        console.log("gwl")
        result.innerText += "username should between 3 and 15 \n";
        isValid = false; 
    }
    const mobileRegex = /^[0-9]{10}$/
    if(!mobileRegex.test(mobileNo)){

        result.innerText += "mobile number must be 10 digit \n"
        isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){

        result.innerText += "invalid email \n";
        isValid = false;
    }
    if(!password.match(confirmPassword)){
        result.innerText += "password not match \n"
        isValid = false;

    }

    if(isValid){
        loader.classList.add("active")
        fetch("/admin/createUser",{
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName,
                mobileNo,
                email,
                password
            })
        }).then((res)=>{
           
           return res.json() 
        }).then((data)=>{

            if(data.status){

                result.innerHTML = data.message;
                setTimeout(()=>{
                    location.href = "/admin";
                },1500)
                loader.classList.remove("active")
            }
            else{
                result.innerHTML = data.message;

            }
            setTimeout(()=>{
                result.innerHTML = ""
            },4000)
        })
    }
})


