var alertbox = document.getElementById("alert")

function login(frm){
    if (frm.username.value.length === 0 || frm.password.value.length === 0){
		alert.innerHTML = "Username or Password field cannot be empty"
	}
	else{
		fetch('http://localhost:3000/api/users/',{
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
                alert.innerHTML = "Username does not exist"
            }
            else{
                return res.json()
            }
        })
		  .then((data)=>{
                console.log(data)    
			  	if (data.token===null){
                    alert.innerHTML = "You've entered a wrong password"
                }
                else{
                    localStorage.setItem("token", data.token)
                    alert("You've successfully logged in! Redirecting you to your space")
                    setTimeout(window.location = "./todo.html", 3000);  
                }
			})
	}
}