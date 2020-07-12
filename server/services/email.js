var nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
    },
});

var controller = {};

controller.transporter = transporter;

controller.sendVerificationEmail = function(email, token, callback) {
    // send mail with defined transport object
    transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: 'Verify Your Email ✔', // Subject line
        text: 'Please verify your account by clicking the link:\n' + process.env.ROOT_URL + '/verify/' + token + '\n' // 
    }, function(err, info){
        if (err) { 
            console.log(err); 
        }
        if (callback){
            callback(err, info)
        }
    });

}

module.exports = controller;
