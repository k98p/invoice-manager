var alertbox = document.getElementById("alert")

fetch('http://localhost:3000/api/users/',{
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        }
    }).then(res=>{
        return res.json()
    }).then((data)=>{
        //console.log(data)
        if (data.length===0){
            document.getElementById('sign').innerHTML = '<a href="#" onclick="signup()" style="color: #DC2C2C;">New User?</a>'
        }
        else{
            document.getElementById('sign').innerHTML = '<a href="#" style="color: #DC2C2C;">Forgot password?</a>'
        }
        //
    })

function signup(){
    fetch('http://localhost:3000/api/users/signup',{
        method: 'POST',
        body: JSON.stringify({
            "username": "admin",
            "password": "admin"
        }),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res=>{
        if (res.status===403){
            alertbox.innerHTML = "<small>Error!</small>"
            setTimeout(()=>{alertbox.innerHTML = ""}, 3000)
        }
        else{
            return res.json()
        }
    })
    .then((data)=>{
            alertbox.innerHTML = "<small>Default username and password set to 'admin'</small>"
            setTimeout(()=>{alertbox.innerHTML = ""}, 3000)
            document.getElementById('sign').innerHTML = '<a href="#" style="color: #DC2C2C;">Forgot password?</a>'
            document.getElementsByClassName('admin')[0].value = "admin"
            document.getElementsByClassName('admin')[1].value = "admin"
        })
}

function login(frm){
    if (frm.username.value.length === 0 || frm.password.value.length === 0){
        alertbox.innerHTML = "<small>Username or Password field cannot be empty<small>"
        setTimeout(()=>{alertbox.innerHTML = ""}, 3000)
    }
    else{
        fetch('http://localhost:3000/api/users/login',{
            method: 'POST',
            body: JSON.stringify({
                "username": frm.username.value,
                "password": frm.password.value
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(res=>{
            if (res.status===403){
                alertbox.innerHTML = "<small>Username does not exist</small>"
                setTimeout(()=>{alertbox.innerHTML = ""}, 3000)
            }
            else{
                return res.json()
            }
        })
        .then((data)=>{
                //console.log(data)    
                if (data.token===null){
                    alertbox.innerHTML = "<small>You've entered a wrong password</small>"
                    setTimeout(()=>{alertbox.innerHTML = ""}, 3000)
                }
                else{
                    localStorage.setItem("token", data.token)
                    window.location = "./products";  
                }
            })
    }
}