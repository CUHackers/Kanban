const path = require('path');
var nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

var controller = {};

controller.transporter = transporter;

viewPath = path.resolve("server/views/");

transporter.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: viewPath,
        layoutsDir: viewPath,
        defaultLayout: false,
    },
    viewPath: viewPath
}));

controller.sendVerificationEmail = function(email, token, callback) {
    // send mail with defined transport object
    transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: 'CUHackit - Verify Your Email ✔',
        template: 'index',
        context: {
            verifyLink: process.env.ROOT_URL + '/verify/' + token
        }
    }, function(err, info){
        if (err) { 
            console.log(err); 
        }
        if (callback){
            callback(err, info)
        }
    });
};

module.exports = controller;
