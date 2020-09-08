var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

/**
 * register user using email and password 
 * body {
 *  email: email,
 *  password: password
 * }
 */
router.post('/register', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    UserController.createUser(email, password, function(err, user){
        if (err){
            return res.status(400).send(err);
        } 
        return res.status(200).send(user);
      });
});


/**
 * log in user with (email and password) or token 
 * body {
 *  email: email,
 *  password: password,
 *  token: token
 * }
 */
router.post('/login', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var token = req.body.token;
    
    if (token) {
        UserController.loginWithToken(token, function(err, token, user){
            if (err || !user) {
                return res.status(400).send(err);
            }
            return res.status(200).json({
                token: token,
                user: user
            });
        })
    }
    else {
        UserController.loginWithPassword(email, password, function(err, token, user) {
            if (err || !user){
                return res.status(400).send(err);
            } 
            return res.status(200).json({
                token: token,
                user: user
            });
        })
    }
});

/**
 * send verification email to user
 * body {
 *  id: id,
 * }
 */
router.post('/verify', function(req, res){
    var id = req.body.id;
    if (id) {
        UserController.sendVerificationEmail(id, function(err, user){
            if (err || !user){
                return res.status(400).send(err);
            } 
            return res.status(200).send();
        });
    } 
    else {
        return res.status(400).send();
    }
})

/**
 *  verify user based on the email token 
 */
router.get('/verify/:token', function(req, res){
    var token = req.params.token;
    UserController.verifyEmail(token, function(err, user){
        if (err || !user){
            return res.status(400).send(err);
        }
        return res.status(200).json(user);
    })
})

/**
 * send reset passsword email to user
 * body {
 *  email: email,
 * }
 */
router.post('/reset', function(req, res){
    var email = req.body.email;
    if (email) {
        UserController.sendResetEmail(email, function(err){
            if (err){
                return res.status(400).send(err);
            } 
            return res.status(200).send();
        });
    } 
    else {
        return res.status(400).send();
    }
})

/**
* resets user password.
* {
*   token: token
*   password: password
* }
*/
router.post('/reset/password', function(req, res){
    var pass = req.body.password;
    var token = req.body.token;

    UserController.resetPassword(token, pass, function(err, user){
        if (err || !user){
            return res.status(400).send(err);
        }
        return res.json(user);
    });
});

module.exports = router