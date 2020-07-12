angular.module('app').
    factory('Session', ['$window', function ($window){ 
        var session = {};

        session.create = function(token, user){
            $window.localStorage.token = token;
            $window.localStorage.id = user.id;
            $window.localStorage.user = JSON.stringify(user);
        };

        session.end = function() {
            delete $window.localStorage.token;
            delete $window.localStorage.id;
            delete $window.localStorage.user;
        };

        // getters
        session.getToken = function() {
            return $window.localStorage.token;
        };

        session.getID = function() {
            return $window.localStorage.id;
        };

        session.getUser = function() {
            return $window.localStorage.user;
        };

        return session;


    }])