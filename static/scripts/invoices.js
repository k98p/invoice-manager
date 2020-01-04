let accesstoken_stored = localStorage.getItem('token')

let count = 0
fetch('http://localhost:3000/api/invoices/', {
    method: 'GET',
    headers: {
        "authorization": `jwt ${accesstoken_stored}` 
    }
})
.then(res => res.json())
.then(data => {
    //console.log(data);
    let buffer = ""
    
    invoice_data = document.getElementsByTagName("tbody")[0];
    data.forEach((invoice)=>{
        count++
        let after_dis = (invoice.total)*(100-invoice.discount)/100
        buffer +=   `<tr>
                        <td class="pl-4">${count}</td>
                        <td>${invoice.customer_name}</td>
                        <td>${invoice.discount}</td>
                        <td>${invoice.total}</td>
                        <td>${after_dis}</td>
                    </tr>`
    })
    invoice_data.innerHTML = buffer;
    //localStorage.setItem("invoice_id", count)
})

function add_invoice(){
    window.location = "./invoice_list"
}