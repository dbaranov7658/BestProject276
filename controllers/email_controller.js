const nodemailer = require('nodemailer')
const ejs = require('ejs')
const User = require('../models/user')

const EventEmitter = require('events');
const app = require('../index')

// const myEmitter = new EventEmitter();

// Set up email transporter
const mailConfig1 = {
        // host: "smtp-relay.sendinblue.com ",
        // port: 587,
        // service: 'SendinBlue',
        service: "Gmail",
        auth: {
            user: process.env.NOTIF_EMAIL_USER,
            pass: process.env.NOTIF_EMAIL_PWD
        }
};
// all emails are catched by ethereal.email
const mailConfig2 = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PWD
    }
};

let transporter = nodemailer.createTransport(mailConfig1);

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
        console.log("Server is ready to take our messages");
        // myEmitter.emit("messages_ready");
        // app.emit("messages_ready");
    }
});

async function sendEmail(req, res, recipient_name, pia_url, event_msg, options) {
    try {
        // remove controllers from __dirname
        let _dirnames_arr = __dirname.split("/")
        let c_index = _dirnames_arr.indexOf("controllers")
        _dirnames_arr.splice(c_index, 1);
        const _abs_dir = _dirnames_arr.join("/")

        // render email template
        let data = await ejs.renderFile(_abs_dir + "/views/email_template.ejs", { recipient: recipient_name, event_msg: event_msg, pia_url: pia_url });
        options.html = data;

        // send email
        let result = await transporter.sendMail(options);

        // get preview link of test email
        // if (process.env.NODE_ENV === 'development') {
        //     console.log('Preview URL: ' + nodemailer.getTestMessageUrl(result));
        // }
            
        console.log(result);
    } catch(err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/**
 * Gets all privacy officers from the database
 * @returns array of officer_emails
 */
async function getPrivacyOfficers() {
    try {
        let officers = await User.find({ isOfficer: 'true' });

        let officer_emails = [];
        officers.forEach(element => {
            officer_emails.push(element.email);   
        });

        return officer_emails;
    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to privacy officers
 * @route  v1/email/emailNewPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailNewPia = async (req, res) => {
    try {
        const user_email = req.params.user_email.substring(1);

        // get url from db
        const pia_url = "http://localhost:3000";

        // get all POs from db
        const recipients = await getPrivacyOfficers();
        const event_msg = `A new Privacy Impact Assessment has been submitted by ${user_email}.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipients,
            subject: "New PIA",
            text: `${event_msg}`, // Fallback message
        }
        await sendEmail(req, res, "Privacy Officer", pia_url, event_msg, options);
        res.json({
            trigger_email: user_email,
            status: "email has been sent",
        });

    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to privacy officers (if general user commented)
 * Sends email to general user (if privacy officer commented)
 * @route  v1/email/emailCommentPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailCommentPia = async (req, res) => {
    try {
        const user_email = req.params.user_email.substring(1);

        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        // get pia users from db and get all POs from db
        const general_user = "userfortisbc@outlook.com";
        let recipients = []
        let recipient_name = ""; 

        if (user_email === general_user) { // later: check if isOfficer
            // get all po's from db
            recipients = await getPrivacyOfficers();
            recipient_name = "Privacy Officer";
        } else {
            recipients.push(general_user);
            recipient_name = "General User";
        }

        // configure email params
        const event_msg = `${user_email} has left a comment on ${pia_name}`;
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipients,
            subject: `New comment on ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }
        await sendEmail(req, res, recipient_name, pia_url, event_msg, options);

    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to privacy officers
 * @route  v1/email/emailEditPia/:user_email
 * @type   POST 
 * @access public
 */
exports.emailEditPia = async (req, res) => {
    try {
        const user_email = req.params.user_email.substring(1);

        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        const recipients = await getPrivacyOfficers();
        const event_msg = `${user_email} has made an edit to ${pia_name}.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipients,
            subject: `New Edit Made to ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }
        await sendEmail(req, res, "Privacy Officer", pia_url, event_msg, options);

    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to general user
 * @route  v1/email/emailEditPia
 * @type   POST 
 * @access public
 */
exports.emailApprovePia = async (req, res) => {
    try {
        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";

        // get pia user from db
        const recipient_email = "userfortisbc@outlook.com";
        const recipient_name = "General User"

        const event_msg = `${pia_name} has been approved.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipient_email,
            subject: `APPROVED: ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }
        await sendEmail(req, res, recipient_name, pia_url, event_msg, options);
    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

/* 
 * Sends email to general user
 * @route  v1/email/emailRejectPia
 * @type   POST 
 * @access public
 */
exports.emailRejectPia = async (req, res) => {
    try {
        // get url from db
        const pia_url = "http://localhost:3000";

        // get name of pia from db
        const pia_name = "PIA #1";


        const recipient_email = "userfortisbc@outlook.com";
        const recipient_name = "General User"

        const event_msg = `${pia_name} has been rejected.`;
        
        const options = {
            from: process.env.NOTIF_EMAIL_USER,
            to: recipient_email,
            subject: `REJECTED: ${pia_name}`,
            text: `${event_msg}`, // Fallback message
        }
        await sendEmail(req, res, recipient_name, pia_url, event_msg, options);

    } catch (err) {
        res.json({
            status: false,
            message: 'Something went wrong'
        })
        console.log(err);
    }
}

