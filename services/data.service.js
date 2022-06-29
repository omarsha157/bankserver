// import json web token

const jwt = require('jsonwebtoken')

const db = require('./db')

// database


// let db = {
//     1000: { "acno": 1000, "username": "Neer", "password": 1000, "balance": 5000, transaction: [] },
//     1001: { "acno": 1001, "username": "Laisha", "password": 1001, "balance": 5000, transaction: [] },
//     1002: { "acno": 1002, "username": "Vypm", "password": 1002, "balance": 3000, transaction: [] }
// }

// register

const register = (username, acno, password) => {

    return db.User.findOne({ acno })
        .then(user => {
            // console.log(user)
            if (user) {
                return {
                    status: false,
                    message: "already registered please login again",
                    statusCode: 401
                }
            } else {
                //? insert in db
                const newUser = new db.User({
                    acno,
                    username,
                    password,
                    balance: 0,
                    transaction: []
                })
                newUser.save()
                return {
                    status: true,
                    message: "registered successfully",
                    statusCode: 200
                }
            }
        })

}


const login = (acno, pswd) => {

    return db.User.findOne({ acno, password: pswd })
        .then(user => {
            if (user) {
                    currentUser = user.username
                    currentAcno = acno
                    token = jwt.sign({
                        currentAcno: acno
                    }, 'supersecretkey12345')
                    return {
                        status: true,
                        message: "login succesful",
                        statusCode: 200,
                        currentUser,
                        currentAcno,
                        token
                    }
            } else {
                return {
                    status: false,
                    message: "invalid credentials",
                    statusCode: 401
                }
            }
        })
}

// deposit

const deposit = (acno, pswd, amt) => {
    let amount = parseInt(amt)
    return db.User.findOne({ acno,password:pswd })
        .then( user => {
            if(user) {
                user.balance += amount
            user.transaction.push({
                type: "credit",
                amount: amount
            })
            user.save()
            return {
                status: true,
                message: amount + " deposited succesfully, new balance is " + user.balance,
                statusCode: 200
            }
            } else {
                return {
                    status: false,
                    message: "invalid credentials",
                    statusCode: 401
                }
            }
        })

}

// withdraw

const withdraw = (acno, pswd, amt) => {
    var amount = parseInt(amt)
    return db.User.findOne({ acno,password:pswd})
        .then(user => {
            if(user) {
                if (user.balance > amount) {
                    user.balance -= amount
                    user.transaction.push({
                        type: "debit",
                        amount: amount
                    })
                    user.save()
                    return {
                        status: true,
                        message: amount + " withdraw succesfully, new balance is " + user.balance,
                        statusCode: 200
                    }
                } else {
                    return {
                        status: false,
                        message: "insufficient balance",
                        statusCode: 422
                    }
                }
            } else {
                return {
                    status: false,
                    message: "invalid credentials",
                    statusCode: 401
                }
            }
        })

}

// transaction

const getTransaction = (acno) => {
    return db.User.findOne({ acno })
        .then( user => {
            if(user) {
                return {
                    status: true,
                    statusCode: 200,
                    transaction: user.transaction
                }
            } else {
                return {
                    status: false,
                    message: "user does not exist",
                    statusCode: 401
                }
            }
        })
}
// export 
module.exports = {
    register,
    login,
    deposit,
    withdraw,
    getTransaction
}