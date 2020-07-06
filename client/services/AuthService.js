angular.module('app')
    .factory('AuthService', ['$http', '$location', 'Session', function ($http, $location, Session) {
        var authService = {};
    
        authService.passwordLogin = function (email, password, cb) {
            return $http
            .post('/auth/login', {
                email: email,
                password: password
            })
            .then(function successCallback(response) {
                Session.create(response.data.token, response.data.user);
                $location.path("/");
            }, function errorCallback(response) {
                $location.path("/login");
                cb(response.data);
            });
        };

        authService.tokenLogin = function (token) {
            return $http
            .post('/auth/login', {
                token: token
            })
            .then(function successCallback(response) {
                Session.create(response.data.token, response.data.user);
            }, function errorCallback(response) {
                Session.end();
                $location.path("/login");
            });
        }

        authService.register = function (email, password, cb) {
            return $http
            .post('/auth/register', {
                email: email,
                password: password
            })
            .then(function successCallback(response) {
                Session.create(response.data.token, response.data.user);
                $location.path("/");
            }, function errorCallback(response) {
                $location.path("/register");
                cb(response.data);
            });
        }

        authService.logout = function() {
            Session.end();
            $location.path("/login");
        }
    
        return authService;
    }])