var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

// still need permission work 
/**
 * get user based on id 
 * id = :id
 */
router.get('/users/:id', function(req, res){
    var id = req.params.id;
    UserController.getUserById(id, function(err, user) {
        if (err){
            return res.status(400).send(err);
        }
        return res.status(200).send(user);
    });
});

// for updating user info (need perimission work)
/**
 * updating user info in the database
 * id = :id
 * body {
 *  info: info 
 * }
 */
router.put('/users/:id/info', function(req, res){
    var info = req.body.info;
    var id = req.params.id;
    UserController.updateInfo(id, info, function(err, user) {
        if (err){
            return res.status(400).send(err);
        } 
        return res.status(200).send(user);
    });
    
});


module.exports = router