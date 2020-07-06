(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var app = angular.module('app', ['ngRoute', 'angularCSS']);

var AuthService = require('./services/AuthService.js');
var AuthInterceptor = require('./services/AuthInterceptor.js');
var UserService = require('./services/UserService.js')
var Session = require('./services/Session.js')
var Routes = require('./route.js')

app.config(['$httpProvider', function($httpProvider){

    $httpProvider.interceptors.push('AuthInterceptor');

}])
.run(['AuthService', 'Session',function(AuthService, Session){

    var token = Session.getToken();
    if (token){
        AuthService.tokenLogin(token);
    }
    
}]);

},{"./route.js":5,"./services/AuthInterceptor.js":6,"./services/AuthService.js":7,"./services/Session.js":8,"./services/UserService.js":9}],2:[function(require,module,exports){
angular.module('app')
    .controller('loginController', ['$scope', 'AuthService', function($scope, AuthService){

        function onError(data){
            $scope.error = data.message;
        }

        $scope.login = function(){
            $scope.error = null;
            AuthService.passwordLogin($scope.email, $scope.password, onError);
        };

    }])
},{}],3:[function(require,module,exports){
angular.module('app')
    .controller('registerController', ['$scope', 'AuthService', 'UserService', 'Session', 
    function($scope, AuthService, UserService, Session){

        $scope.genders = [
            {value: '', display: 'Gender'},
            {value: 'male', display: 'Male'},
            {value: 'female', display: 'Female'},
            {value: 'other', display: 'Other'},
        ];

        $scope.year = [
            {value: '', display: 'Graduation Year'},
            {value: '2021', display: '2021'},
            {value: '2022', display: '2022'},
            {value: '2023', display: '2023'},
            {value: '2024', display: '2024'}
        ];

        function onError(data){
            $scope.error = data.message;
        }

        $scope.register = async function(){
            $scope.error = null;
            await AuthService.register($scope.info.email, $scope.info.password, onError);
            UserService.updateInfo(Session.getID(), $scope.info);
        };


    }])
},{}],4:[function(require,module,exports){
angular.module('app')
    .controller('sidebarController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){

        $scope.isRouteActive = function(route) { 
            console.log(route === $location.path());
            return route === $location.path();
        }

        $scope.logout = function(){
            AuthService.logout();
        };

    }])
},{}],5:[function(require,module,exports){
var LoginCtrl = require('./controllers/loginController.js');
var RegisterCtrl = require('./controllers/registerController.js');
var sidebarCtrl = require('./controllers/sidebarController')

angular.module('app').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    
    $routeProvider
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController',
        css: 'stylesheets/login.css',
        data: {
            Login: false
         }
    })

    .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController',
        data: {
            Login: false
         }
    })

    .when('/', {
        templateUrl: 'views/dashboard.html',
        css: 'stylesheets/dashboard.css',
        data: {
            Login: true
         }
    })

    .when('/404', {
        templateUrl: 'views/404.html',
        data: {
            Login: false
         }
    })
    
    .otherwise({
        redirectTo : '/404'
    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}])
.run(['$rootScope', '$location', 'Session', function($rootScope, $location, Session){
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        // if logged in, go to dashboard
        if (next.templateUrl === 'views/login.html' && Session.getToken()) {
            $location.path("/");
        }

        if (next.templateUrl === 'views/register.html' && Session.getToken()) {
            $location.path("/");
        }

        // check if user logged in
        if (next.data.Login && !Session.getToken()) {
            $location.path("/login");
        }


    });
}])
},{"./controllers/loginController.js":2,"./controllers/registerController.js":3,"./controllers/sidebarController":4}],6:[function(require,module,exports){
angular.module('app').
    factory('AuthInterceptor', ['Session', function (Session) {
        return {
            request: function(config) {
                var token = Session.getToken();
                if(token){
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }
        };
    }]);
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
angular.module('app').
    factory('Session', ['$window', function ($window){ 
        var session = {};

        session.create = function(token, user){
            $window.localStorage.token = token;
            $window.localStorage.id = user.id;
            $window.localStorage.user = user;
        };

        session.end = function() {
            delete $window.localStorage.token;
            delete $window.localStorage.id;
            delete $window.localStorage.user;
        };

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
},{}],9:[function(require,module,exports){
angular.module('app').
    factory('UserService', ['$http', function ($http){ 
        var userService = {};

        userService.updateInfo = function (id, info) {
            return $http.put('/api/users/' + id + '/info', {
                info: info
              });
        }
        return userService;


    }])
},{}]},{},[1]);
