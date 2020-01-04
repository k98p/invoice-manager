let accesstoken_stored = localStorage.getItem('token')

function fetchall(){
    fetch('http://localhost:3000/api/products/', {
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
        prod_data = document.getElementsByTagName("tbody")[0];
        data.forEach((product)=>{
            count++;
            buffer +=   `<tr>
                            <td class="pl-4">${product.name}</td>
                            <td>${product.price}</td>
                            <td><button class="edit" data-toggle="modal" data-target="#edit-prod-form" onclick="edit_form('${product._id}')"><img src="static/images/edit.png"></button></td>
                        </tr>`
        })
        prod_data.innerHTML = buffer;
    })
}

fetchall();

function edit_form(id){
    //console.log("working" + id)
    fetch('http://localhost:3000/api/products/'+id , {
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
        document.getElementById("edit_price").value = data[0].price
    })
}

function edit_prod(frm){
    if (frm.name.value==="" || frm.price.value===""){
        document.getElementById("result_edit").innerHTML = "<small>Input fields cannot remain empty!</small>"
        setTimeout(()=>{document.getElementById("result_edit").innerHTML = ""}, 3000)
    }
    else{
        const id = document.getElementById("edit_id").innerHTML
        //console.log(id)
        fetch('http://localhost:3000/api/products/' + id ,{
            method: 'PUT',
            body: JSON.stringify({
                "name": frm.name.value,
                "price": frm.price.value
            }),
            headers: {
                "Content-type": "application/json",
                "authorization": `jwt ${accesstoken_stored}`
            }
        }).then(res=>{
            return res.json()
        })
        .then((data)=>{
            document.getElementById("result_edit").innerHTML = "<small>Product edited successfully!</small>"
            setTimeout(()=>{document.getElementById("result_edit").innerHTML = ""}, 3000)
            fetchall()
        })
    }
    
}

function add_prod(frm){
    if (frm.name.value==="" || frm.price.value===""){
        document.getElementById("result_add").innerHTML = "<small>Input fields cannot remain empty!</small>"
        setTimeout(()=>{document.getElementById("result_add").innerHTML = ""}, 3000)
    }
    else{
        fetch('http://localhost:3000/api/products',{
            method: 'POST',
            body: JSON.stringify({
                "name": frm.name.value,
                "price": frm.price.value
            }),
            headers: {
                "authorization": `jwt ${accesstoken_stored}`,
                "Content-type": "application/json"
            }
        }).then(res=>{
            return res.json()
        })
        .then((data)=>{
            document.getElementById("result_add").innerHTML = "<small>Product added successfully!</small>"
            setTimeout(()=>{document.getElementById("result_add").innerHTML = ""}, 3000)
            fetchall()
        })
    } 
    
}