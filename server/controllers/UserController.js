var validator = require('validator');
var User = require('../models/User');

var UserController = {};

// REGISTERATION METHODS 
UserController.createUser = async function(email, password, callback) {
    email = email.toLowerCase();

    if (typeof email !== "string"){
        return callback({
            message: "Email must be a string."
        });
    }

    if (!email.endsWith(".edu")) {
        return callback({
            message: "Use your educational email"
        });
    }

    if (!password || password.length < 6) {
        return callback({
            message: "Password must be 6 characters or more"
        });
    }

    // creating the user and adding it to the database 
    var u = new User();
    u.email = email
    u.password = await User.hashPassword(password);
    u.id = await User.generateID();
    u.save({overwrite: false}, async function(err){
        if(err) {
            if (err.code === 'ConditionalCheckFailedException' && err.statusCode === 400) {
                return callback({
                  message: 'An account for this email already exists.'
                });
            }
        }
        else {
            var token = await u.generateToken();

            return callback(null, {
                token: token,
                user: u
            });
        }
    });
}

// LOGIN METHODS 
UserController.loginWithToken = function(token, callback){
    User.verifyToken(token, function(err, user){
        if (user) {
            var u = user[0]
            delete u.password;
        }
        return callback(err, token, u);
    });
};

UserController.loginWithPassword = function(email, password, callback){
    // check for empty password
    if (!password || password.length === 0){
        return callback({
            message: 'Please enter a password'
        });
    }
    
    // check for email
    if (!validator.isEmail(email)){
        return callback({
            message: 'Invalid email'
        });
    }

    // check if email exist in db
    User.findEmail(email, async function(err, user) {
        if (err) {
            return callback(err);
        }
        if (!user) {
            return callback({
                message: "The email or password is incorrect!"
            });
        }
        // check for password 
        var result = await user.checkPassword(password)
        if (!result) {
            return callback({
                message: "The email or password is incorrect!"
            });
        }
        var token = await user.generateToken();
        delete user.password;
        return callback(null, token, user);
    });
}

// UPDATE METHODS 
UserController.updateInfo = async function(id, info, callback) {
    var result = await User.scan('id').eq(id).exec();
    var u = result[0];
    u.info = info;
    u.save(function(err){
        if(err) {
            return callback({
                message: err
              });
        }
        else {
            delete u.password;
            return callback(null, u);
        }
    });

}

module.exports = UserController;