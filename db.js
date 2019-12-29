const uri = 'mongodb://localhost:27017/invoice'

const mongoose = require('mongoose')
mongoose.connect(uri)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', ()=>{
    console.log('Database connected')
})

var customerSchema = mongoose.Schema({
    id: Number,
    name: String,
    address: String,
    phone: String
})

var productSchema = mongoose.Schema({
    //id: Number,
    name: String,
    price: Number
})

var invoiceSchema = mongoose.Schema({
    //id: Number,
    customer_id: Number,
    discount: Number,
    total: Number
})

var invoiceitemSchema = mongoose.Schema({
    //id: Number,
    invoice_id: Number,
    product_id: Number,
    quantity: Number
})

var userSchema = mongoose.Schema({
    username: String,
    password: String
})

exports.Customer = mongoose.model('Customer', customerSchema)
exports.Product = mongoose.model('Product', productSchema)
exports.Invoice = mongoose.model('Invoice', invoiceSchema)
exports.Invoice_item = mongoose.model('Invoice_item', invoiceitemSchema)
exports.User = mongoose.model('User', userSchema)

// To construct DB, type: 'mongoimport --db invoice --collection users --drop --file user_list.json --jsonArray'