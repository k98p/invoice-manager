const express = require('express')
const engines = require('consolidate')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const env = require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())
app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')


const User = require('./db').User
const Customer = require('./db').Customer
const Product = require('./db').Product
const Invoice = require('./db').Invoice
const Invoice_item = require('./db').Invoice_item

//============================APIs============================

//CUSTOMERS

app.get("/api/customers", (req, res)=>{
    Customer.find({}, (err, data)=>{
        res.json(data);
    })
})

app.post("/api/customers", (req, res)=>{
    let customer = req.body
    Customer.create(customer, (err, data)=>{
        res.json(data)
    })
})

app.get("/api/customers/:id", (req, res)=>{
    Customer.find({id: id}, (err, data)=>{
        res.json(data);
    })
})

app.put("/api/customers/:id", (req, res)=>{
    let id = req.params.id
    let update = req.body

    // Customer.findOne({id: id}, (err, data)=>{
    //     Customer.findOneAndUpdate({id: id}, update, (err, data)=>{
    //         res.json(data)
    //     })
    // })
    Customer.findOneAndUpdate({id: id}, update, (err, data)=>{
        res.json(data)
    })
    //best way...use a submit button in form to automatically reload
})

app.delete("/api/customers/:id", (req, res)=>{
    let id = req.params.id
    Customer.remove({id: id}, (err, data)=>{
        res.json(data)
    })
    // {
    // "n": 0,          
    // "ok": 1,
    // "deletedCount": 0        //1 for successful delete
    // }
})

//PRODUCTS

app.get("/api/products", (req, res)=>{
    Product.find({}, (err, data)=>{
        res.json(data);
    })
})

app.post("/api/products", (req, res)=>{
    let product = req.body
    Product.create(product, (err, data)=>{
        res.json(data)
    })
})

app.get("/api/products/:id", (req, res)=>{
    Product.find({id: id}, (err, data)=>{
        res.json(data);
    })
})

app.put("/api/products/:id", (req, res)=>{
    let id = req.params.id
    let update = req.body
    Product.findOneAndUpdate({id: id}, update, (err, data)=>{
        res.json(data)
    })
})

app.delete("/api/products/:id", (req, res)=>{
    let id = req.params.id
    Product.remove({id: id}, (err, data)=>{
        res.json(data)
    })
})

//INVOICES

app.get("/api/invoices", (req, res)=>{
    Invoice.find({}, (err, data)=>{
        res.json(data);
    })
})

app.post("/api/invoices", (req, res)=>{
    let invoice = req.body
    Invoice.create(invoice, (err, data)=>{
        res.json(data)
    })
})

app.get("/api/invoices/:id", (req, res)=>{
    Invoice.find({id: id}, (err, data)=>{
        res.json(data);
    })
})

app.put("/api/invoices/:id", (req, res)=>{
    let id = req.params.id
    let update = req.body
    Invoice.findOneAndUpdate({id: id}, update, (err, data)=>{
        res.json(data)
    })
})

app.delete("/api/invoices/:id", (req, res)=>{
    let id = req.params.id
    Invoice.remove({id: id}, (err, data)=>{
        res.json(data)
    })
})

//============================Views===========================

app.get("/login", (req, res)=>{
    res.render('login')
})

const server = app.listen(3000, ()=>{
    console.log("Server running at", server.address().port)
})