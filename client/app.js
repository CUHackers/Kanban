var app = angular.module('app', ['ngRoute', 'angularCSS']);


// routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    
    $routeProvider
    .when('/login', {
        templateUrl: 'views/login.html',
        css: 'stylesheets/login.css'
    })

    .when('/register', {
        templateUrl: 'views/register.html',
    })
    
    .otherwise({
        redirectTo : '/'
    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}])