angular.module('app').
    factory('Session', ['$window', '$rootScope', function ($window, $rootScope){ 
        var session = {};

        session.create = function(token, user){
            $window.localStorage.token = token;
            $window.localStorage.id = user.id;
            $window.localStorage.user = JSON.stringify(user);
            $rootScope.currentUser = user;
        };

        session.end = function() {
            delete $window.localStorage.token;
            delete $window.localStorage.id;
            delete $window.localStorage.user;
            $rootScope.currentUser = null;
        };

        // getters
        session.getToken = function() {
            return $window.localStorage.token;
        };

        session.getID = function() {
            return $window.localStorage.id;
        };

        session.getUser = function() {
            return JSON.parse($window.localStorage.user);
        };

        //setter
        session.setUser = function(user){
            $window.localStorage.user = JSON.stringify(user);
            $rootScope.currentUser = user;
        };

        return session;


    }])