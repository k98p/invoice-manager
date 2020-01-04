//let invoice_id = localStorage.getItem("invoice_id")
let accesstoken_stored = localStorage.getItem('token')
let total = 0;
let count = 0;

fetch('http://localhost:3000/api/customers/', {
    method: 'GET',
    headers: {
        "authorization": `jwt ${accesstoken_stored}` 
    }
})
.then(res => res.json())
.then(data => {
    //console.log(data);
    let names_option = document.getElementById('customer_names')
    let buffer = ""
    data.forEach((customer)=>{
        buffer += `<option value="${customer._id} ${customer.name}">${customer.name}</option>`
    })
    names_option.innerHTML += buffer;
})

let product_buffer = ""

fetch('http://localhost:3000/api/products/', {
    method: 'GET',
    headers: {
        "authorization": `jwt ${accesstoken_stored}` 
    }
})
.then(res => res.json())
.then(data => {
    //console.log(data);
    data.forEach((product)=>{
        product_buffer += `<option value="${product._id} ${product.name}">${product.name}</option>`
        localStorage.setItem(product._id, product.price)
    })
    document.getElementById("total_value").innerHTML = total
})

function add_invoice_item(){
    count++;
    let form_list = document.getElementById("invoice-items-forms-div");
    form_list.innerHTML +=  `

    <form name="invoice-items-details" class="border forms my-4" id="${count}">
        <div class="row px-4 py-3">
            <div class="col-md-6">
                <div class="row name-block pt-2">
                    <div class="col-md-12">
                        <label for="prod_name">Product Name</label>
                    </div>
                    <div class="col-md-12" id="name_${count}">
                        <select name="prod_name" class="product_names form-control">
                            <option class="lol" value="" disabled selected>Select</option>
                            ${product_buffer}
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="row quantity-block py-2">
                    <div class="col-md-12">
                        <label for="quantity">Quantity</label>
                    </div>
                    <div class="col-md-12" id="quantity_${count}">
                        <input type="number" class="form-control" name="quantity">
                    </div>
                </div>
            </div>
            <div class="col-md-1 submit-block text-center pt-2">
                <button class="interact" name="add" type="button" onclick = "submit_invoice_item(this.form)"><img src="static/images/checkmark-16.png" height="16px" width="16px"></button>
            </div>
        </div>
        <div class="row px-4">
            <div class="col-md-12 warning text-center">
                <p id="warning_${count}"></p>
            </div>
            
        </div> 
    </form>`            
}

// function submit_invoice_item(frm){
//     fetch('http://localhost:3000/api/invoices/' + invoice_id + '/items',{
//         method: 'POST',
//         body: JSON.stringify({
//             "invoice_id": invoice_id,
//             "product_id": frm.prod_name.value.split(" ")[0],
//             "product_name": frm.prod_name.value.split(" ")[1],
//             "quantity": frm.quantity.value
//         }),
//         headers: {
//             "Content-type": "application/json"
//         }
//     }).then(res=>{
//         return res.json()
//     })
//     .then((data)=>{
//         console.log(data)
//         document.getElementById("total_value").innerHTML = +document.getElementById("total_value").innerHTML + +localStorage.getItem(data.product_id)*data.quantity
    
//     })
// }



let invoice_list = {}


function submit_invoice_item(frm){
    
    if(frm.prod_name.value==="" || frm.quantity.value===""){
        document.getElementById(`warning_${frm.id}`).innerHTML = "<small>Product details cannot be empty!</small>"
        setTimeout(()=>{document.getElementById(`warning_${frm.id}`).innerHTML = ""}, 3000)
    }
    else{
        //temp.push(.substr(0,str.indexOf(' '))
        let str = frm.prod_name.value
        
        invoice_list[frm.id] = 
            {
                "product_id": str.substr(0,str.indexOf(' ')),
                "product_name": str.substr(str.indexOf(' ')+1),
                "quantity": +frm.quantity.value,
                "price": +localStorage.getItem(str.substr(0,str.indexOf(' ')))*(+frm.quantity.value)
            }

        total += +localStorage.getItem(str.substr(0,str.indexOf(' ')))*(+frm.quantity.value)
        document.getElementById("total_value").innerHTML = total
        frm.add.value = "Delete"
        frm.add.setAttribute("onclick", `delete_invoice_item(${frm.id})`)
        frm.add.innerHTML = `<img src="static/images/delete-button.png" height="18px" width="16px"></img>`
        document.getElementById(`name_${frm.id}`).innerHTML = `<div class="border px-3 py-2">${str.substr(str.indexOf(' ')+1)}</div>`
        document.getElementById(`quantity_${frm.id}`).innerHTML = `<div class="border px-3 py-2">${frm.quantity.value}</div>`
    }
    
}

function delete_invoice_item(id){
    total = total - invoice_list[id].price
    delete invoice_list[id];
    document.getElementById("total_value").innerHTML = total
    document.getElementById(id).setAttribute("style", "display: none;")
}

function add_invoice(){
    let cus_details = document.getElementById("customer_names").value
    let disc_val = document.getElementById("discount").value
    if (cus_details==="" || disc_val===""){
        document.getElementsByClassName('warning')[0].innerHTML = "<small>Customer details cannot be empty!</small>"
        setTimeout(()=>{document.getElementsByClassName('warning')[0].innerHTML = ""}, 3000)
    }
    else if(+disc_val<0 || +disc_val>100){
        document.getElementsByClassName('warning')[0].innerHTML = "<small>Discount should be between 0 and 100!</small>"
        setTimeout(()=>{document.getElementsByClassName('warning')[0].innerHTML = ""}, 3000)
    }
    else{
        //console.log(cus_details)
        let cus_id = cus_details.split(' ')[0]
        let cus_name = cus_details.split(' ')[1]
        
        fetch('http://localhost:3000/api/invoices/', {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "authorization": `jwt ${accesstoken_stored}` 
            },
            body: JSON.stringify({
                "customer_name": cus_name,
                "customer_id": cus_id,
                "discount": disc_val,                            
                "total": (+document.getElementById("total_value").innerHTML)
            })
        })
        .then(res => res.json())
        .then(data => {
            let invoice_id = data._id
            
            for (var product in invoice_list){
                fetch('http://localhost:3000/api/invoices/' + invoice_id + '/items',{
                    method: 'POST',
                    body: JSON.stringify({
                        "invoice_id": invoice_id,
                        "product_id": product.product_id,
                        "product_name": product.product_name,
                        "quantity": product.quantity
                    }),
                    headers: {
                        "Content-type": "application/json",
                        "authorization": `jwt ${accesstoken_stored}` 
                    }
                })
            
            }
            window.location = './invoices'
        })
    }
    
}
