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

    if (!email.endsWith("clemson.edu")) {
        return callback({
            message: "Use your Clemson email"
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
            else {
                return callback({
                    message: err
                });
            }
        }
        else {
            var token = await u.generateToken();
            delete u.password;

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
 * get user based on the token
 * @param {String} token 
 * @param {Function} callback 
 */
UserController.getByToken = function(token, callback){
    User.verifyToken(token, function(err, user){
        if (user) {
            var u = user[0]
            delete u.password;
        }
        return callback(err, u);
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

// EMAIL METHODS

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

        if (result.count === 0) {
            return callback({
                message: "No user found"
            });
        }
        
        var user = result[0];
        if(user) {
            delete user.password;
        }
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
        if (err) {
            return callback(err);
        }
        
        if (email) {
            email.toLowerCase();
            User.get(email, function(err, user) {
                user.status.verified = true;
                var status = user.status;
                User.update(
                    {
                        email: email.toLowerCase()
                    },
                    {
                        $SET: {
                            status: status
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
                    }
                )
            })
        }
    })
}

/**
 * Send password reset email to user
 * @param {String} email user email
 * @param {Function} callback 
 */
UserController.sendResetEmail = function(email, callback) {
    User.query("email").eq(email).exec(async function(err, result){
        if (err){
            return callback(err);
        }

        if (result.count === 0) {
            return callback({
                message: "No user found"
            });
        }

        var user = result[0];
        var token = await user.generateTempAuthToken();
        Mailer.sendPasswordResetEmail(email, token, callback);
    })
}

/**
 * resets usre password
 * @param {String} token temp auth token 
 * @param {String} password new password
 * @param {Function} callback 
 */
UserController.resetPassword = function(token, password, callback){
    if (!password || !token){
        return callback({
            message: 'Bad arguments'
        });
    }
    
    if (password.length < 6){
        return callback({
            message: 'Password must be 6 or more characters.'
        });
    }

    User.verifyTempAuthToken(token, function(err, oldPass) {
        if(err || !oldPass){
            return callback(err);
        }

        User.scan('password').eq(oldPass).exec(async function(err, result) {

            if (err) {
                return callback({
                    message: err
                });
            }

            if (result.count === 0) {
                return callback({
                    message: "Invalid Token"
                });
            }

            var user = result[0];
            var newPass = await User.hashPassword(password); 
            User.update(
                {
                    email: user.email.toLowerCase()
                },
                {
                    $SET: {
                        password: newPass
                    }
                }, 
                function(err, u){
                    if(err) {
                        return callback({
                            message: err
                        });
                    }
                    else {
                        Mailer.sendPasswordChangedEmail(u.email);
                        delete u.password;
                        return callback(null, u);
                    }
            })
        })
    })
}

// GETTER METHODS

/**
 * get an user from the database using user id
 * @param {String} id user's id
 * @param {Function} callback callback function 
 */
UserController.getUserById = function(id, callback) {
    User.scan('id').eq(id).exec(function(err, result){
        if (err || !result) {
            return callback({
                message: err
            });
        }

        if (result.count === 0) {
            return callback({
                message: "No user found"
            });
        }

        var u = result[0];
        delete u.password;
        return callback(null, u);
    });
}

/**
 * get users based on the filter
 * @param {*} query contains query text and search filter
 * @param {Function} callback callback function 
 */
UserController.getUsers = function(query, callback) {
    var searchText = query.query;
    var filter = query.filter;
    const attributes = ['email', 'id', 'rfid', 'info', 'status', 'createdAt', 'updatedAt', 'confirmation'];

    if (filter) {
        User.scan(filter).contains(searchText).attributes(attributes).exec(function(err, result) {
            if (err || !result) {
                return callback(err);
            }

            return callback(null, result);
        })
    }
    else {
        // without special query filter
        User.scan()
         .filter('email').contains(searchText).attributes(attributes).or()
         .filter('info.name').contains(searchText).attributes(attributes).or()
         .filter('info.cuid').contains(searchText).attributes(attributes).or()
         .exec(function(err, result) {
            if (err || !result) {
                return callback(err);
            }

            return callback(null, result);
        })
    }

}

/**
 * get all user from the database
 * @param {*} callback callback function
 */
UserController.getAll = function(callback) {
    const attributes = ['email', 'id', 'rfid', 'info', 'status', 'createdAt', 'updatedAt', 'confirmation'];

    User.scan().attributes(attributes).exec(function(err, result){
        if (err || !result) {
            return callback(err);
        }

        return callback(null, result);
    })

}

// SETTER METHODS 

/**
 * updates user info in the database 
 * @param {String} id user id 
 * @param {Object} info info objects that contains basic registration info
 * @param {Function} callback callback function 
 */
UserController.updateInfo = function(id, info, callback) {
    User.scan('id').eq(id).exec(function(err, result) {

        if (err || !result) {
            return callback({
                message: err
            });
        }

        if (result.count === 0) {
            return callback({
                message: "No user found"
            });
        }

        var user = result[0];
        // user completes application
        user.status.completedApp = true;
        var status = user.status;

        User.update(
            {
                email: user.email.toLowerCase()
            },
            {
                $SET: {
                    info: info,
                    status: status
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

/**
 * updates user info in the database 
 * @param {String} id user id 
 * @param {Object} conf confirmation objects that contains user confirmation form data
 * @param {Function} callback callback function 
 */
UserController.updateConf = function(id, conf, callback) {
    User.scan('id').eq(id).exec(function(err, result) {

        if (err || !result) {
            return callback({
                message: err
            });
        }

        if (result.count === 0) {
            return callback({
                message: "No user found"
            });
        }

        var user = result[0];
        // user completes application
        user.status.confirmed = true;
        var status = user.status;

        User.update(
            {
                email: user.email.toLowerCase()
            },
            {
                $SET: {
                    confirmation: conf,
                    status: status
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
    })
}

/**
 * assign RFID to user and check in the user
 * @param {String} id uid of user
 * @param {Function} callback callback function
 */
UserController.assignID = function(id, rfid, callback) {
    User.scan('id').eq(id).exec(function(err, result) {

        if (err || result) {
            return callback({
                message: err
            });
        }

        if (result.count === 0) {
            return callback({
                message: "No user found"
            });
        }

        var user = result[0];
        // make sure rfid is not already assigned
        User.scan('rfid').eq(rfid).exec(function(err, result) {

            if (err) {
                return callback({
                    message: err
                });
            }

            if (result.count === 0) {
                // checks user in and assign rfid
                user.status.checkin = true;
                var status = user.status;
                User.update(
                    {
                        email: user.email.toLowerCase()
                    },
                    {
                        $SET: {
                            status: status,
                            rfid: rfid
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
            }
            else {
                return callback({
                    message: "RFID already assigned to another user"
                });
            }
        })
    })
}

/**
 * checks in/out of an user based on rfid
 * @param {String} rfid rfid of an user
 * @param {*} callback 
 */
UserController.checkin = function(rfid, callback) {
    User.scan('rfid').eq(rfid).exec(function(err, result) {

        if (err || !result) {
            return callback({
                message: err
            });
        }

        // if no user is associated with rfid
        if (result.count === 0) {
            return callback({
                message: "RFID is not assigned to any user"
            });
        }

        var user = result[0];
        // check in/out based on current status
        if (user.status.checkin) {
            // check out user
            user.status.checkin = false;
            var status = user.status;
            User.update(
                {
                    email: user.email.toLowerCase()
                },
                {
                    $SET: {
                        status: status
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
        }
        else {
            // check in user
            user.status.checkin = true;
            var status = user.status;
            User.update(
                {
                    email: user.email.toLowerCase()
                },
                {
                    $SET: {
                        status: status
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
        }
        
    })
}

/**
 * accepts an user
 * @param {String} id user id
 * @param {Function} callback callback function 
 */
UserController.acceptUser = function(id, callback) {
    User.scan('id').eq(id).exec(function(err, result) {

        if (err || !result) {
            return callback({
                message: err
            });
        }

        if (result.count === 0) {
            return callback({
                message: "No user found"
            });
        }

        var user = result[0];
        user.status.accepted = true;
        var status = user.status;

        User.update(
            {
                email: user.email.toLowerCase()
            },
            {
                $SET: {
                    status: status
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
    })
}


module.exports = UserController;