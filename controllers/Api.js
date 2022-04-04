const User = require("../models/user");
const jwt = require("jsonwebtoken");
const existingPia = require("../models/piaSchema");
const {sendEmail, getPrivacyOfficers} = require("../Emails/emails");
const Path = require("path");
const ejs = require("ejs");
const pdf = require('html-pdf');

const fs = require('fs');

var myCss = {
    style : fs.readFileSync('./printFunctionality/template.css','utf8'),
};


exports.login = async  (req, res) => {
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
}

exports.getAllPia = (req, res, ) => {
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
}

exports.isUserAuth = (req, res) => {
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
}

exports.deletePia = (req, res,) => {
    const token = req.headers["x-access-token"]
    const id = req.body.id
    let pia_name = "A PIA"
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id) {
            // Verify that user is privacy officer
            User.findById(decoded.id, (error, result) => {
                if (result === null) {
                    res.json({
                        isSuccess: false,
                        error: error,
                        message: "Can not get user from db",
                    })
                } if (!result.isOfficer) {
                    res.json({
                        isSuccess: false,
                        error: "PermissionError",
                        message: "User does not have delete permissions",
                    })
                } else {
                    existingPia.findById(id, (error, result) => {
                        if (error) {
                            res.json({
                                isSuccess: false,
                                message: "Unable to delete Pia",
                            })
                        }
                        else {
                            if (result) {
                                pia_name = result.pia.projectName
                                User.findById(result.creatorId, (error, result) => {
                                    if (error) {
                                        res.json({
                                            isSuccess: false,
                                            message: "Unable to delete Pia",
                                        })
                                    }
                                    else {
                                        if (result) {
                                            const recipients = result.email
                                            existingPia.deleteOne({ _id: id }).then((result) => {
                                                if (result.deletedCount === 1) {
                                                    res.json({
                                                        isSuccess: true,
                                                        message: "Successfully deleting Pia",
                                                    })
                                                    const event_msg = `${pia_name} has been deleted.`
                                                    const options = {
                                                        from: process.env.NOTIF_EMAIL_USER,
                                                        to: recipients,
                                                        subject: `DELETED: ${pia_name}`,
                                                        text: `${event_msg}`, // Fallback message
                                                    }
                                                    sendEmail("friend", event_msg, options).then((result) => {
                                                        console.log(result)
                                                    })
                                                }
                                                else {
                                                    res.json({
                                                        isSuccess: false,
                                                        message: "Unable to delete Pia",
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}

exports.addNew = (req, res, ) => {
    const newPia = req.body.Pia
    const token = req.headers["x-access-token"]
    jwt.verify(token, process.env.JWT_VAR, (err, decoded) => {
        if (decoded.id){
            let insertedPia = new existingPia({
                pia: newPia,
                creatorId: decoded.id,
                status: "PENDING",
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
                    User.findById(decoded.id, async (error, user) => {
                        if (error){
                            res.json({
                                isSuccess: false,
                                error: err,
                                message: "Can not get User email",
                            })
                        }else{
                            if (user){
                                res.json({
                                    isSuccess: true,
                                    message: "Successfully submitted",
                                })
                                const userMail = user.email
                                const event_msg = `A new Privacy Impact Assessment has been submitted by ${userMail}.`
                                const recipients = await getPrivacyOfficers()
                                const options = {
                                    from: process.env.NOTIF_EMAIL_USER,
                                    to: recipients,
                                    subject: "New PIA",
                                    text: `${event_msg}`, // Fallback message
                                }
                                sendEmail("friend", event_msg, options).then((result) => {
                                    console.log(result)
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}

exports.printPia = (req, res, ) => {
    const printedPia = req.body.Pia
    const token = req.headers["x-access-token"]
    console.log(printedPia);

    jwt.verify(token, process.env.JWT_VAR, async (err, decoded) => {
        if (decoded.id && printedPia){
            try{
                const htmlPath = Path.join(__dirname, "../printFunctionality/printTemplate.ejs")
                
                let dataForPDF = await ejs.renderFile(htmlPath,{ 
                    myCss: myCss,
                    projectName: printedPia.pia.projectName, 
                    sponsoringBusinessUnit: printedPia.pia.sponsoringBusinessUnit, 
                    projectDescription: printedPia.pia.projectDescription ? printedPia.pia.projectDescription.replace(/['"]+/g, '') : '', 
                    isCollected: Boolean(printedPia.pia.isCollected),
                    personalInfo: printedPia.pia.personalInfo ?  printedPia.pia.personalInfo.replace(/['"]+/g, '')  : '',
                    purpose: printedPia.pia.purpose,
                    individualsInfo: printedPia.pia.individualsInfo ? printedPia.pia.individualsInfo.replace(/['"]+/g, '')  : '',
                    date: printedPia.createdAt.slice(0, 10).toString(),
                    isDisclosed: printedPia.pia.isDisclosed,
                    disclosedInfo: printedPia.pia.disclosedInfo ? printedPia.pia.disclosedInfo.replace(/['"]+/g, '')    : '',
                },{async:true});
                
                var options = { 
                    // height: '842px', width: '595px', 
                    format: 'A4', type: "pdf",
                    // "header": {"height": "10mm"}, 
                    "footer": {"height": "10mm"} };

                pdf.create(dataForPDF, options).toFile('./test.pdf', async (err, user) => {
                    if (err) {
                        res.json({
                            isSuccess: false,
                            message: "Issue with printing Pia",
                        })
                    }
                    else{
                        var file = fs.createReadStream('./test.pdf');
                        var stat = fs.statSync('./test.pdf');
                        res.setHeader('Content-Length', stat.size);
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
                        file.pipe(res);                        
                    }
                });

            } catch(error){
                console.log(error);
                res.json({
                    isSuccess: false,
                    message: "Issue with printing Pia",
                })
            }
        }
    })
}