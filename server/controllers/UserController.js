var validator = require('validator');
var User = require('../models/User');
var Mailer = require('../services/email');

var UserController = {};

// REGISTERATION METHODS 

/**
 * register user in the database
 * @param {String} email user email
 * @param {String} password user password
 * @param {Function} callback callback function  
 */
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

/**
 * log in user with auth token 
 * @param {String} token auth token  
 * @param {Function} callback callback function  
 */
UserController.loginWithToken = function(token, callback){
    User.verifyToken(token, function(err, user){
        if (user) {
            var u = user[0]
            delete u.password;
        }
        return callback(err, token, u);
    });
};

 /**
  * log in user using email and password
  * @param {String} email user email 
  * @param {String} password user password
  * @param {Function} callback callback function  
  */
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

// VERIFICATION METHODS

/**
 * sends email verification
 * @param {String} email user email
 * @param {Function} callback callback function
 */
UserController.sendVerificationEmail = function(id, callback) {
    User.scan('id').eq(id).exec(async function(err, result) {
        if (err || !result) {
            return callback(err);
        }
        var user = result[0];
        var token = await user.generateEmailVerificationToken();
        Mailer.sendVerificationEmail(user.email, token);
        return callback(null, user);
    })
}

/**
 * verify email auth token and updates user status(verify)
 * @param {String} token email auth token 
 * @param {Function} callback callback function 
 */
UserController.verifyEmail = function(token, callback) {
    User.verifyEmailToken(token, function(err, email) {
        if (email) {
            email.toLowerCase();
            User.get(email, function(err, user) {
                user.status.verify = true;
                var status = user.status;
                User.update(
                    {
                        email: email.toLowerCase()
                    },
                    {
                        $SET: {
                            status: status
                        }
                    }, callback)
            })
        }
    })
}


// GETTER METHODS

/**
 * get an user from the database using user id
 * @param {String} id user's id
 * @param {Function} callback callback function 
 */
UserController.getUserById = function(id, callback) {
    User.scan('id').eq(id).exec(function(err, user){
        if (err) {
            return callback({
                message: "No user found"
              });
        }
        var u = user[0];
        delete u.password;
        return callback(null, u);
    });
}

// SETTER METHODS 

/**
 * updates user info in the database 
 * @param {String} id user id 
 * @param {Object} info info objects that contains basic registration info
 * @param {Function} callback callback function 
 */
UserController.updateInfo = function(id, info, app, callback) {
    User.scan('id').eq(id).exec(function(err, result) {
        user = result[0];

        if (err) {
            return callback({
                message: err
            });
        }

        // check if updateInfo is called from completing applcation 
        if (app) {
            user.status.application = true;
            var status = user.status;
            User.update(
                {
                    email: user.email.toLowerCase()
                },
                {
                    $SET: {
                        status: status
                    }
                })
        }

        User.update(
            {
                email: user.email.toLowerCase()
            },
            {
                $SET: {
                    info: info
                }
            }, 
            function(err, u){
                if(err) {
                    return callback({
                        message: err
                    });
                }
                else {
                    delete u.password;
                    return callback(null, u);
                }
            })
        });

}

module.exports = UserController;