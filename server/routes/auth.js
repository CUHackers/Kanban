var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');


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

module.exports = router