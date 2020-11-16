var validator = require('validator');
var dynamoose = require("dynamoose");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var { v1: uuidv1 } = require('uuid');

var schema = new dynamoose.Schema({

    email: {
        type: String,
        required: true,
        hashKey: true,
        validate: validator.isEmail
    },

    password: {
        type: String,
        required: true
    },

    rfid: {
        type: String,
        require: true,
        default: ""
    },

    id: {
        type: String,
        require: true
    },

    admin: {
        type: Boolean,
        required: true,
        default: false
    },

    // basic user info from application
    info: {
        type: Object,
        schema: {
            name: {
                type: String,
                required: true,
                default: ""
            },

            cuid: {
                type: String,
                required: true,
                default: ""
            },

            first: {
                type: String,
                required: true,
                default: ""
            },

            sex: {
                type: String,
                required: true,
                default: ""
            },

            pronouns: {
                type: String,
                required: true,
                default: ""
            },

            race: {
                type: String,
                required: true,
                default: ""
            },

            shirt: {
                type: String,
                required: true,
                default: ""
            },

            teammates: {
                type: String,
                required: true,
                default: ""
            },

            experience: {
                type: String,
                required: true,
                default: ""
            },

            discord: {
                type: String,
                required: true,
                default: ""
            },

            frq1: {
                type: String,
                required: true,
                default: ""
            },

            frq2: {
                type: String,
                required: true,
                default: ""
            },

            frq3: {
                type: String,
                required: true,
                default: ""
            },

            frq4: {
                type: String,
                required: true,
                default: ""
            },

            frq5: {
                type: String,
                required: false,
                default: ""
            },

            frq6: {
                type: String,
                required: false,
                default: ""
            },

            mlh: {
                type: Boolean,
                required: true,
                default: false
            },

            auth: {
                type: Boolean,
                required: true,
                default: false
            }
        }

    },

    status: {
        type: Object,
        schema: {
            // email verify status
            verified: {
                type: Boolean,
                required: true,
                default: false
            },

            // completed application or not
            completedApp: {
                type: Boolean,
                required: true,
                default: false
            },

            // user accpeted or not
            accepted: {
                type: Boolean,
                required: true,
                default: false
            },

            // user confirmed their acceptance or not
            confirmed: {
                type: Boolean,
                required: true,
                default: false
            },

            // user declined their acceptance or not
            declined: {
                type: Boolean,
                required: true,
                default: false
            },

            // checked in with rfid
            checkin: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    },

    confirmation: {
        type: Object,
        schema: {
            phone: {
                type: String,
                required: true,
                default: ""
            },

            address: {
                type: Object,
                schema: {
                    street: {
                        type: String,
                        required: true,
                        default: ""
                    },

                    apartNum: {
                        type: String,
                        required: true,
                        default: ""
                    },

                    city: {
                        type: String,
                        required: true,
                        default: ""
                    },

                    state: {
                        type: String,
                        required: true,
                        default: ""
                    },

                    zip: {
                        type: String,
                        required: true,
                        default: ""
                    },
                }
            }
        }
    }
},
{
    'timestamps': true
});

var User = dynamoose.model('UserTable2020', schema);

// static methods

/**
 * find user based on email
 * @param {String} email user email
 */
User.methods.set("findEmail", async function (email) {
    var u = await this.get(email);
    return u;
});

/**
 * hash user password
 * @param {String} password user password
 */
User.methods.set("hashPassword", async function (password) {
    return hash = bcrypt.hash(password, await bcrypt.genSalt(10));
});

/**
 * generate unique id for user based on timestamp
 */
User.methods.set("generateID", async function () {
    return uuidv1();
});

/**
 * verify auth token and returns user if token valid
 * @param {String} token auth token
 */
User.methods.set("verifyToken", function (token, callback) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, id){
        if (err) {
            return callback(err);
        }
        this.scan('id').eq(id).exec(callback);
    }.bind(this));
});

/**
 * verify email token and return email string
 *  @param {String} token email auth token
 */
User.methods.set("verifyEmailToken", function (token, callback) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, email) {
        return callback(err, email);
    });
});

/**
 * Verify a temporary authentication token.
 * @param  {[type]}   token    temporary auth token
 * @param  {Function} callback args(err, id)
 */
User.methods.set("verifyTempAuthToken", function(token, callback) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, payload){

        if (err || !payload){
            return callback(err);
        }

        if (!payload.exp || Date.now() >= payload.exp * 1000){
            return callback({
                message: 'Token has expired.'
            });
        }

        return callback(null, payload.oldPass);
    });
});

// instance methods

/**
 * check password
 * @param {String} password user password
 */
User.methods.document.set("checkPassword", async function (password) {
    return bcrypt.compare(password, this.password);
});


/**
 * generate auth token based on user uid
 */
User.methods.document.set("generateToken", async function () {
    return jwt.sign(this.id, process.env.JWT_SECRET);
});

/**
 * generate verification token based on email
 */
User.methods.document.set("generateEmailVerificationToken", async function() {
    return jwt.sign(this.email, process.env.JWT_SECRET);
})

/**
 * generates temp token for password reset
 * make it single use by using old password hash
 * exception if user sets same password for new password
 */
User.methods.document.set("generateTempAuthToken", async function(){
    return jwt.sign({
        oldPass: this.password
    }, process.env.JWT_SECRET, {
        expiresIn: 60 * 30
    });
});


module.exports = User
