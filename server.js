require('dotenv').config()

var express = require('express');
var app = express();
var dynamoose = require("dynamoose");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


// database
dynamoose.aws.sdk.config.update({
    "accessKeyId": process.env.ACCESS_KEY,
    "secretAccessKey": process.env.SECRET_KEY,
    "region": process.env.REGION
});

// init databases
var init = require('./init');

// setup
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(express.static(__dirname +'/client'));

//route
api = require('./server/routes/api');
app.use('/api', api)

auth = require('./server/routes/auth');
app.use('/auth', auth)

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});


app.listen(port, function() {
    console.log('app running');
});