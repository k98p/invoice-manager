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

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = process.env.ACCESS_TOKEN;
        // console.log(token);
        // Here we validate that the JSON Web Token is valid and has been
        // created using the same private pass phrase
        jwt.verify(token, privateKey, (err, user) => {

            // if there has been an error...
            if (err) {
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
                // throw new Error("Not Authorized");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            req.user = user;
            next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error
        res.status(500).json({ error: "Not Authorized" });
        // throw new Error("Not Authorized");
    }
}

//============================APIs============================

//CUSTOMERS

app.get("/api/customers", (req, res)=>{
    Customer.find({}, (err, data)=>{
        res.json(data);
    })
})

app.post("/api/customers", (req, res)=>{
    let customer = req.body
    console.log(customer)
    Customer.create(customer, (err, data)=>{
        res.json(data)
    })
})

app.get("/api/customers/:id", (req, res)=>{
    const id = req.params.id
    console.log(id)
    Customer.find({_id: id}, (err, data)=>{
        console.log(data)
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
    Customer.findOneAndUpdate({_id: id}, update, (err, data)=>{
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
    let id = req.params.id
    Product.find({_id: id}, (err, data)=>{
        res.json(data);
    })
})

app.put("/api/products/:id", (req, res)=>{
    let id = req.params.id
    let update = req.body
    Product.findOneAndUpdate({_id: id}, update, (err, data)=>{
        res.json(data)
    })
})

app.delete("/api/products/:id", (req, res)=>{
    let id = req.params.id
    Product.remove({_id: id}, (err, data)=>{
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
    console.log(invoice)
    Invoice.create(invoice, (err, data)=>{
        res.json(data)
    })
})

app.get("/api/invoices/:id", (req, res)=>{
    Invoice.find({_id: id}, (err, data)=>{
        res.json(data);
    })
})

app.put("/api/invoices/:id", (req, res)=>{
    let id = req.params.id
    let update = req.body
    Invoice.findOneAndUpdate({_id: id}, update, (err, data)=>{
        console.log(data)
        res.json(data)
    })
})

app.delete("/api/invoices/:id", (req, res)=>{
    let id = req.params.id
    Invoice.remove({id: id}, (err, data)=>{
        res.json(data)
    })
})

//INVOICE_ITEMS

app.get("/api/invoices/:invoice_id/items", (req, res)=>{
    Invoice_item.find({}, (err, data)=>{
        res.json(data);
    })
})

app.post("/api/invoices/:invoice_id/items", (req, res)=>{
    let invoice = req.body
    console.log(invoice)
    Invoice_item.create(invoice, (err, data)=>{
        res.json(data)
    })
})

app.get("/api/invoices/:invoice_id/items/:id", (req, res)=>{
    Invoice_item.find({id: id}, (err, data)=>{
        res.json(data);
    })
})

app.put("/api/invoices/:invoice_id/items/:id", (req, res)=>{
    let id = req.params.id
    let update = req.body
    Invoice_item.findOneAndUpdate({id: id}, update, (err, data)=>{
        res.json(data)
    })
})

app.delete("/api/invoices/:invoice_id/items/:id", (req, res)=>{
    let id = req.params.id
    Invoice_item.remove({id: id}, (err, data)=>{
        res.json(data)
    })
})

//USER / ADMIN

app.get('/data/users', (req,res)=>{
    try{
		User.find({},(error, data)=>{
			res.json(data);
		})
	}
	catch(e){
		res.sendStatus(404);
	}
})

app.post('/api/users/signup', (req,res)=>{
    const username = req.body.username
    User.findOne({username: username}, async (error, user)=>{
        if (user===null){
            const salt = await bcrypt.genSalt()
            const hashedpassword = await bcrypt.hash(req.body.password,salt)
            const data = {
                username: req.body.username,
                password: hashedpassword
            }
            //console.log(data)
            User.create(data, (error , new_user)=>{
                res.json(new_user)
            })        
        }
        else{
            res.send("User exists!")
        }
    })    
})

app.post('/api/users/login', (req,res)=>{
    const username = req.body.username
    User.findOne({username: username}, (error,user)=>{
        //console.log(user)
        if(user!==null){
            bcrypt.compare(req.body.password, user.password, (err,result)=>{  
                if (result){
                    const privateKey = process.env.ACCESS_TOKEN;
                    const token = jwt.sign({ username : username}, privateKey);
                    res.json({token: token});
                }
                else{
                    res.json({token: null})
                }
            })
        }
        else{
            res.sendStatus(403);
        }
    })
})

//============================Views===========================

app.get("/login", (req, res)=>{
    res.render('login')
})

app.get("/customer", (req, res)=>{
    res.render('customer')
})

app.get("/products", (req, res)=>{
    res.render('products')
})

app.get("/invoices", (req, res)=>{
    res.render('invoices')
})

app.get("/invoice_list", (req, res)=>{
    res.render('invoice_list')
})

const server = app.listen(3000, ()=>{
    console.log("Server running at", server.address().port)
})