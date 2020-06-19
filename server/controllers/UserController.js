var validator = require('validator');
var User = require('../models/User');

var UserController = {};

UserController.createUser = async function(email, password, callback) {

    if (typeof email !== "string"){
      return callback({
        message: "Email must be a string."
      });
    }

    // creating the user and adding it to the database 
    email = email.toLowerCase();
    var u = new User();
    u.email = email
    u.password = await User.hashPassword(password);
    u.save(function(err){
        if(err) {
            console.log(err);
        }
        else {
            return callback(null, {
                user: u
            });
        }
    });
}

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
              message: "This email is not found"
            });
        }
        // check for password 
        var result = await user.checkPassword(password)
        if (!result) {
            return callback({
              message: "That's not the right password."
            });
        }
        return callback(null, user);
    })

}

module.exports = UserController;