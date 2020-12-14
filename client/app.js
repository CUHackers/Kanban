var $ = require("jquery");
var angular = require('angular');
var uiRouter = require('angular-ui-router');

var app = angular.module('app', ['ui.router']);

var AuthService = require('./services/AuthService.js');
var AuthInterceptor = require('./services/AuthInterceptor.js');
var Session = require('./services/Session.js');
var Routes = require('./route.js');

app.config(['$httpProvider', function($httpProvider){

    $httpProvider.interceptors.push('AuthInterceptor');

}])
.run(['AuthService', 'Session',function(AuthService, Session){

    var token = Session.getToken();
    if (token){
        AuthService.tokenLogin(token);
    }
    
}]);
