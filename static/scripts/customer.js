let accesstoken_stored = localStorage.getItem('token')

function fetchall(){
    fetch('http://localhost:3000/api/customers/', {
        method: 'GET',
        headers: {
            "authorization": `jwt ${accesstoken_stored}` 
        }
    })
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        let count = 0;
        let buffer = ""
        cust_data = document.getElementsByTagName("tbody")[0];
        data.forEach((customer)=>{
            count++;
            buffer +=   `<tr>
                            <td class="pl-4">${customer.name}</td>
                            <td>${customer.address}</td>
                            <td>${customer.phone}</td>
                            <td><button class="edit" data-toggle="modal" data-target="#edit-cust-form" onclick="edit_form('${customer._id}')"><img src="static/images/edit.png"></button></td>
                        </tr>`
        })
        cust_data.innerHTML = buffer;
    })
}

fetchall();

function edit_form(id){
    //console.log("working" + id)
    fetch('http://localhost:3000/api/customers/'+id , {
        method: 'GET',
        headers: {
            "authorization": `jwt ${accesstoken_stored}` 
        }
    }).then(res=>{
        return res.json()
    }).then((data)=>{
        //console.log(data)
        document.getElementById("edit_id").innerHTML = data[0]._id
        document.getElementById("edit_name").value = data[0].name
        document.getElementById("edit_add").value = data[0].address
        document.getElementById("edit_phone").value = data[0].phone
    })
}

function edit_cust(frm){
    if (frm.name.value==="" || frm.address.value==="" || frm.phone.value===""){
        document.getElementById("result_edit").innerHTML = "<small>Input fields cannot remain empty!</small>"
        setTimeout(()=>{document.getElementById("result_edit").innerHTML = ""}, 3000)
    }
    else{
        const id = document.getElementById("edit_id").innerHTML
        //console.log(id)
        fetch('http://localhost:3000/api/customers/' + id ,{
            method: 'PUT',
            body: JSON.stringify({
                "name": frm.name.value,
                "address": frm.address.value,
                "phone": frm.phone.value
            }),
            headers: {
                "authorization": `jwt ${accesstoken_stored}`,
                "Content-type": "application/json"
            }
        }).then(res=>{
            return res.json()
        })
        .then((data)=>{
            document.getElementById("result_edit").innerHTML = "<small>Customer edited successfully!</small>"
            setTimeout(()=>{document.getElementById("result_edit").innerHTML = ""}, 3000)
            fetchall()
        })
    }
    
}

function add_cust(frm){
    if (frm.name.value==="" || frm.address.value==="" || frm.phone.value===""){
        document.getElementById("result_add").innerHTML = "<small>Input fields cannot remain empty!</small>"
        setTimeout(()=>{document.getElementById("result_add").innerHTML = ""}, 3000)
    }
    else{
        fetch('http://localhost:3000/api/customers',{
            method: 'POST',
            body: JSON.stringify({
                "name": frm.name.value,
                "address": frm.address.value,
                "phone": frm.phone.value
            }),
            headers: {
                "authorization": `jwt ${accesstoken_stored}` ,
                "Content-type": "application/json"
            }
        }).then(res=>{
            return res.json()
        })
        .then((data)=>{
            frm.name.value=""
            frm.address.value=""
            frm.phone.value=""
            document.getElementById("result_add").innerHTML = "<small>Customer added successfully!</small>"
            setTimeout(()=>{document.getElementById("result_add").innerHTML = ""}, 3000)
            fetchall()
        })
    }
    
}