var LoginCtrl = require('./controllers/loginController');
var RegisterCtrl = require('./controllers/registerController');
var sidebarCtrl = require('./controllers/sidebarController')
var dashboardCtrl = require('./controllers/dashboardController')
var verifyCtrl = require('./controllers/verifyController')
var workshopCtrl = require('./controllers/workshopController')
var applicationCtrl = require('./controllers/applicationController')
var adminCtrl = require('./controllers/adminController')

angular.module('app').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    
    $routeProvider
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController',
        css: 'stylesheets/login.css',
        data: {
            login: false
         }
    })

    .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController',
        data: {
            login: false
         }
    })

    .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardController',
        css: 'stylesheets/dashboard.css',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
              },
        },
        data: {
            login: true
         }
    })

    .when('/application', {
        templateUrl: 'views/application.html',
        controller: 'applicationController',
        css: 'stylesheets/application.css',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
              },
        },
        data: {
            login: true,
            verified: true
        }
    })

    .when('/workshop', {
        templateUrl: 'views/workshop.html',
        controller: 'workshopController',
        css: 'stylesheets/workshop.css',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
              },
        },
        data: {
            login: true,
            verified: true
        }
    })

    .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'adminController',
        css: 'stylesheets/admin.css',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
              },
        },
        data: {
            login: true,
            verified: true,
            admin: true
        }
    })

    .when('/verify/:token', {
        templateUrl: 'views/verify.html',
        controller: 'verifyController',
        data: {
            login: false
         }
    })

    .when('/404', {
        templateUrl: 'views/404.html',
        data: {
            login: false
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
.run(['$rootScope', '$location', 'Session', 'UserService', function($rootScope, $location, Session, UserService){
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        // if logged in, go to dashboard
        if (next.templateUrl === 'views/login.html' && Session.getToken()) {
            $location.path("/");
        }

        if (next.templateUrl === 'views/register.html' && Session.getToken()) {
            $location.path("/");
        }

        // check if user logged in
        if (next.data.login && !Session.getToken()) {
            $location.path("/login");
        }
        
        // check if user is verified or not
        // problem here with to get access to page by changing local storage value
        // but should be okay since actions still checks permission 
        if (next.data.verified && !Session.getUser().status.verify) {
            $location.path("/");
        }

        // check for admin status
        if (next.data.admin && !Session.getUser().admin) {
            $location.path("/");
        }

    });
}])