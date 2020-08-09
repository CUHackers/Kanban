angular.module('app')
    .factory('AuthService', ['$http', '$state', 'Session', function ($http, $state, Session) {
        var authService = {};
        
        /**
         * login using password 
         * @param {String} email user email 
         * @param {String} password user password
         * @param {Function} cb callback function
         */
        authService.passwordLogin = function (email, password, cb) {
            return $http
            .post('/auth/login', {
                email: email,
                password: password
            })
            .then(function successCallback(response) {
                Session.create(response.data.token, response.data.user);
                $state.go('app.dashboard');
            }, function errorCallback(response) {
                $state.go('login');
                cb(response.data);
            });
        };

        /**
         * login using token
         * @param {String} token auth token 
         */
        authService.tokenLogin = function (token) {
            return $http
            .post('/auth/login', {
                token: token
            })
            .then(function successCallback(response) {
                Session.create(response.data.token, response.data.user);
            }, function errorCallback(response) {
                Session.end();
                $state.go('login');
            });
        }

        /**
         * register user 
         * @param {String} email user email
         * @param {String} password user password
         * @param {Function} cb callback function
         */
        authService.register = function (email, password, cb) {
            return $http
            .post('/auth/register', {
                email: email,
                password: password
            })
            .then(function successCallback(response) {
                Session.create(response.data.token, response.data.user);
                $state.go('app.dashboard');
            }, function errorCallback(response) {
                $state.go('register');
                cb(response.data);
            });
        }

        // log out function
        authService.logout = function() {
            Session.end();
            $state.go('login');
        }

        // sends verification email to user
        authService.sendVerificationEmail = function() {
            return $http
            .post('/auth/verify', {
                id: Session.getID()
            });
        }

        authService.verify = function(token, callback) {
            return $http
            .get('/auth/verify/' + token)
            .then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                callback(null);
            });
        }
    
        return authService;
    }])