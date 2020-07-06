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

    id: {
        type: String,
        require: true
    },

    // basic user info from registration 
    info: {
        type: Object,
        schema: {
            name: {
                type: String,
                required: true,
                default: "NA"
            },
        
            gender: {
                type: String,
                required: true,
                default: "NA"
            },

            phone: {
                type: String,
                required: true,
                default: "NA"
            },

            school: {
                type: String,
                required: true,
                default: "NA"
            },

            gradyr: {
                type: String,
                required: true,
                default: "NA"
            },
        }

    },

    status: {
        type: Object,
        schema: {
            verify: {
                type: Boolean,
                required: true,
                default: false
            }
        
        }

    }
    
}, 
{
    'timestamps': true
});

var User = dynamoose.model('UserTable', schema);

// static methods
User.methods.set("findEmail", async function (email) {
    var u = await this.get(email);
    return u;
});

User.methods.set("hashPassword", async function (password) {
    return hash = bcrypt.hash(password, await bcrypt.genSalt(10));
});

User.methods.set("generateID", async function () {
    return uuidv1();
});

User.methods.set("verifyToken", function (token, callback) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, id){
        if (err) {
            return callback(err);
        }
        this.scan('id').eq(id).exec(callback);
    }.bind(this));
});

// instance methods
User.methods.document.set("checkPassword", async function (password) {
    return bcrypt.compare(password, this.password);
});

User.methods.document.set("generateToken", async function () {
    return jwt.sign(this.id, process.env.JWT_SECRET);
});


module.exports = User