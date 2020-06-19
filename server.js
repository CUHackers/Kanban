require('dotenv').config()

var express = require('express');
var app = express();
var dynamoose = require("dynamoose");
var bodyParser = require('body-parser');


// database
dynamoose.aws.sdk.config.update({
    "accessKeyId": process.env.ACCESS_KEY,
    "secretAccessKey": process.env.SECRET_KEY,
    "region": process.env.REGION
});

// setup
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static('client'));

//route
app.route('/*').get(function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

api = require('./server/routes/api');
app.use('/api', api)

app.listen(port, function() {
    console.log('app running');
});