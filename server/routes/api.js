var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

router.get('/', function(req, res) {
    res.send('api');
});

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

      UserController.loginWithPassword(email, password, function(err, user) {
        if (err || !user){
            console.log(400)
            return res.status(400).send(err);
        } 
        console.log(200)
        return res.status(200).send(user);
      })
});

module.exports = router