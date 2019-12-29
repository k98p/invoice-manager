const express = require('express')

const app = express()

app.get("/", (req, res)=>{
    res.send("TEST")
})

const server = app.listen(3000, ()=>{
    console.log("Server running at ", server.address().port)
})