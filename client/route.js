var LoginCtrl = require('./controllers/loginController.js');
var RegisterCtrl = require('./controllers/registerController.js');

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