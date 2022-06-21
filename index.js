
// import express

const express = require('express')
const jwt = require('jsonwebtoken')
const dataService = require('./services/data.service')



// create server app

const app = express()

// parse json

app.use(express.json())

// application specific middleware

// const appMiddleware = (req,res,next) => {
//     console.log("application specific middleware");
//     next()
// }

// use middleware in app

// app.use(appMiddleware)

const jwtMiddleware = (req, res, next) => {
    try {
        token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'supersecretkey12345')
        console.log(data)
        next()
        } catch {
            res.status(401).json({
                status: false,
                statusCode:401,
                message:"please login"
            })
        }
}

// bank server
// register api
app.post('/register', (req, res) => {
    // resolve register here
    const result = dataService.register(req.body.username, req.body.acno, req.body.password)
    res.status(result.statusCode).json(result)
})

// login

app.post('/login', (req,res) => {
    const result = dataService.login(req.body.acno, req.body.pswd)
    res.status(result.statusCode).json(result)
})

// deposit

app.post('/deposit',jwtMiddleware, (req,res) => {
    const result = dataService.deposit(req.body.acno, req.body.pswd, req.body.amt)
    res.status(result.statusCode).json(result)
})

// withdraw

app.post('/withdraw',jwtMiddleware, (req,res) => {
    const result = dataService.withdraw(req.body.acno, req.body.pswd, req.body.amt)
    res.status(result.statusCode).json(result)
})

// transaction

app.post('/transaction',jwtMiddleware, (req,res) => {
    const result = dataService.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)
})

// setup a port number

app.listen(3000, () => {
    console.log("server started at 3000");
})

// user request resolving

// get for fetching data

// app.get('/', (req, res) => {
//     res.send("GET request")
// })

// post for creating data 

// app.post('/', (req, res) => {
//     res.send("POST request")
// })

// put for modifying data

// app.put('/', (req, res) => {
//     res.send("PUT request")
// })

// patch for modifying partially

// app.patch('/', (req, res) => {
//     res.send("PATCH request")
// })

// delete to delete data

// app.delete('/', (req, res) => {
//     res.send("DELETE request")
// })