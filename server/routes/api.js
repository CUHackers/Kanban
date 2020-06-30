var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

router.put('/users/:id/info', function(req, res){
    var info = req.body.info;
    var id = req.params.id;
    UserController.updateInfo(id, info, function(err, user) {
        if (err){
            console.log(err);
            return res.status(400).send(err);
        } 
        return res.status(200).send(user);
    });
    
});


module.exports = router