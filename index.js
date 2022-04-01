const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')

const nodemailer = require('nodemailer')
const ejs = require('ejs')
var cors = require('cors');
const EventEmitter = require('events');

const existingPia = require('./models/piaSchema')

const app = express()
const PORT = process.env.PORT || 3000
const path = require('path')

const myEmitter = new EventEmitter();

const  reactBuild = path.join(__dirname, 'front', 'build')

const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.json({
            auth: false,
            status: "There is not token",
        })
    } else{
        jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
            if (err){
                res.json({
                    auth: false,
                    status: "you are fail to auth",
                })
            } else {
                next()
            }
        })
    }
}

require("dotenv").config()

app.use(express.static(reactBuild))
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', cors());

app.use('/v1/email', require('./routes/email_route'))

app.get('/test', (req,res)=>{
    res.json({
        status: true,
    })
})

app.post('/login', (req, res) => {
    const mail = req.body.email
    User.findOne({email: mail}).then((result) => {
        if (result !== null){
            const id = result._id
            const token = jwt.sign({id}, process.env.JWT_VAR, {
                expiresIn: 2000
            })
            res.json({
                auth: true,
                token: token,
                isOfficer: result.isOfficer
            })
        }
        else {
            res.json({
                auth: false,
                message: "You are not in database"
            })
        }

    })
})

app.post('/addNew', verifyJWT, (req, res, ) => {
    const newPia = req.body.Pia
    const token = req.headers["x-access-token"]
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id){
            let insertedPia = new existingPia({
                pia: newPia,
                creatorId: decoded.id,
                status: "PENDING",
                comments: "",
                date: new Date()
            })
            insertedPia.save((err, user) => {
                if (err) {
                    res.json({
                        isSuccess: false,
                        error: err,
                        message: "Can not save it in db",
                    })
                }
                else{
                    res.json({
                        isSuccess: true,
                        message: "Successfully submitted",
                    })
                }
            })
        }

    })



})

app.get('/editPia:id', verifyJWT, (req, res) => {


})

app.post('/deletePia', verifyJWT, (req, res, ) => {
    const token = req.headers["x-access-token"]
    const id = req.body.id
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id){
            existingPia.deleteOne({_id: id}).then((result) => {
                if (result.deletedCount === 1){
                    res.json({
                        isSuccess: true,
                        message: "Successfully deleting Pia",
                    })
                }
                else{
                    res.json({
                        isSuccess: false,
                        message: "Unable to delete Pia",
                    })
                }
            })
        }

    })



})

app.post('/getAllPia', verifyJWT, (req, res, ) => {
    const token = req.headers["x-access-token"]
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id){
            User.findById(decoded.id , (error, result) => {
                if (result === null){
                    res.json({
                        isSuccess: false,
                        error: error,
                        message: "Can not get user from db",
                    })
                } else if (error){
                    console.log(error)
                    res.json({
                        isSuccess: false,
                        error: error,
                        message: "Can not get all pia from db",
                    })
                }
                else{
                    if (result.isOfficer){
                        existingPia.find({}, (err, result) => {
                            if (err){
                                res.json({
                                    isSuccess: false,
                                    error: error,
                                    message: "Can not get all pia from db",
                                })
                            }
                            else{
                                if (result){
                                    res.json({
                                        isSuccess: true,
                                        allPia: result
                                    })
                                }
                            }
                        })
                    }
                    else{
                        existingPia.find({creatorId: decoded.id}, (error, result) => {
                            if (error){
                                res.json({
                                    isSuccess: false,
                                    error: error,
                                    message: "Can not get all pia from db",
                                })
                            }
                            else{
                                res.json({
                                    isSuccess: true,
                                    allPia: result
                                })
                            }
                        })
                    }
                }
            })
        }

    })



})

app.post('/isUserAuth', (req, res) => {
    const token = req.headers["x-access-token"]
    if (!token) {
        res.json({
            auth: false,
            status: "Token not provided",
        })
    } else {
       jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
            if (err){
                res.json({
                    auth: false,
                    status: "error during verifying token",
                })
            } else {
                User.findById(decoded.id , (error, result) => {
                    if (result === null){
                        res.json({
                            auth: false,
                            status: "error during verifying token",
                        })
                    } else if (error){
                        console.log(error)
                        res.json({
                            auth: false,
                            status: "error during verifying token",
                        })
                    }
                    else{
                        res.json({
                            auth: true,
                            status: "success auth",
                            isOfficer: result.isOfficer,
                            email: result.email
                        })
                    }
                })
            }
        })
    }

})


app.get('/*', async(req, res) => {
    res.sendFile(path.join(reactBuild, 'index.html'))
})


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {
    console.log('connected to db')
    app.listen(PORT, () => {
        console.log('server is running on ' + PORT)
        app.emit("app_started")
        // myEmitter.on("messages_ready", () => {
        //     console.log("messages ready");
        //     app.emit("messages_ready")
        // })
    })
    }
).catch((err) => {
        console.log(err)
})

module.exports = app;

