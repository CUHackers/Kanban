var validator = require('validator');
var dynamoose = require("dynamoose");
var bcrypt = require('bcrypt');

var schema = new dynamoose.Schema({

    email: {
        type: String,
        required: true,
        hashKey: true,
        validate: validator.isEmail
    },

    password: {
        type: String,
        required: true,
    },
    
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

// instance methods
User.methods.document.set("checkPassword", async function (password) {
    return bcrypt.compare(password, this.password);
});


module.exports = User