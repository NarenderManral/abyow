// Import Package
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
var fs = require("fs");

const config = require('./config');

// Set Package
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Server Start Notification
app.listen(3000, () => console.log("Server Started on port 3000..."));

// Set Static Folder Path
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Get Index Page Request
app.get ('/', (req, res) => {
    res.render(config.theme);
});


app.post('/subscribe-email',(req,res)=>{
    // Alert if successfully subscribe
    const successAlert = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
                Thank you for Subscribing !! We will notify you
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                </button>
        </div>
    `;

    // Alert if failed to subscribe
    const failAlert = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                Failed to subscribe. Please refresh this page
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                </button>
        </div>
    `;
    let email = req.body.email;

    // write to a new file named 2pac.txt
    fs.appendFile('subscribe.txt', email+"\n", (err) => {
    // throws an error, you could also catch it here
    console.log("Before");
    if (err) {
        console.log(err);
        res.render(config.theme, {msg1: failAlert});
    };

    // success case, the file was saved
    console.log(email);
    res.render(config.theme, {msg1: successAlert});
    });


});
// Post Email Request
app.post('/send', (req, res) => {

    // Email Template
    const output = `
        <p>You have a message</p>
        <h3>Contact Details</h3>
        <p>Name: ${req.body.name}</p>
        <p>Email: ${req.body.email}</p>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // Alert if successfully sending email
    const successAlert = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
                Message has been sent
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                </button>
        </div>
    `;

    // Alert if failed to sending email
    const failAlert = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                Failed to send message. Please refresh this page
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                </button>
        </div>
    `;


    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(
        `smtps://${config.user}:${config.pass}@smtp.gmail.com`,
    );

    // Use this is you want to use Gmail SMTP
//     let transporter = nodemailer.createTransport(
//             `smtps://${config.user}:${config.pass}@smtp.gmail.com`
//     );

    // Setup email settings
    let mailOptions = {
            from: config.from,
            to: config.to,
            subject: config.subject,
            html: output
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                    res.render(config.theme, {msg: failAlert});
            }
            res.render(config.theme, {msg: successAlert});
    });
});
