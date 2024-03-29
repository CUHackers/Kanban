var UserService = require('./services/UserService.js')
var SettingsService = require('./services/SettingsService.js')

var loginCtrl = require('./controllers/loginController');
var registerCtrl = require('./controllers/registerController');
var forgotCtrl = require('./controllers/forgotController');
var sidebarCtrl = require('./controllers/sidebarController');
var dashboardCtrl = require('./controllers/dashboardController');
var verifyCtrl = require('./controllers/verifyController');
var resetCtrl = require('./controllers/resetController');
var workshopCtrl = require('./controllers/workshopController');
var applicationCtrl = require('./controllers/applicationController');
var adminCtrl = require('./controllers/adminController');
var adminUsersCtrl = require('./controllers/adminUsersController');
var adminCheckInCtrl = require('./controllers/adminCheckInController');
var confirmationCtrl = require('./controllers/confirmationController');
var settingsCtrl = require('./controllers/adminSettingsController');
var statsCtrl = require('./controllers/adminStatsController');

angular.module('app').config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
 function($stateProvider, $locationProvider, $urlRouterProvider){
    
    $urlRouterProvider.otherwise("/404");

    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: 'loginController',
        data: {
          login: false
        }
    })
    
    .state('register', {
        url: "/register",
        templateUrl: 'views/register.html',
        controller: 'registerController',
        data: {
            login: false
        }
    })

    .state('forgot', {
        url: "/forgot",
        templateUrl: 'views/forgot.html',
        controller: 'forgotController',
        data: {
            login: false
        }
    })

    .state('app', {
        views: {
            '': {
                templateUrl: "views/base.html"
        },
            'sidebar@app': {
                templateUrl: "views/sidebar.html",
                controller: 'sidebarController'
            }
        },
        data: {
          login: true
        }
    })

    .state('app.dashboard', {
        url: "/",
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardController',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
            },
            settings: function(SettingsService) {
                return SettingsService.getTime();
            }
        }
    })

    .state('app.application', {
        url: "/application",
        templateUrl: 'views/application.html',
        controller: 'applicationController',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
            },
            settings: function(SettingsService) {
                return SettingsService.getTime();
            }
        },
        data: {
            verified: true
        }
    })

    /** hide for now
    .state('app.confirmation', {
        url: "/confirmation",
        templateUrl: 'views/confirmation.html',
        controller: 'confirmationController',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
            },
        },
        data: {
            verified: true,
            accepted: true
        }
    })
    **/

    .state('app.workshop', {
        url: "/workshop",
        templateUrl: 'views/workshop.html',
        controller: 'workshopController',
        resolve: {
            currentUser: function(UserService){
                return UserService.getCurrentUser();
            },
        },
        data: {
            verified: true
        }
    })

    .state('app.admin', {
        views: {
            '': {
                templateUrl: "views/admin.html",
                controller: 'adminController',
            }
        },
        data: {
          admin: true
        }
    })

    .state('app.admin.stats', {
        url: "/admin",
        templateUrl: "views/stats.html",
        controller: 'adminStatsController'
    })

    .state('app.admin.users', {
        url: "/admin/users",
        templateUrl: "views/users.html",
        controller: 'adminUsersController'
    })

    .state('app.admin.checkin', {
        url: "/admin/checkin",
        templateUrl: "views/checkin.html",
        controller: 'adminCheckInController'
    })

    .state('app.admin.settings', {
        url: "/admin/settings",
        templateUrl: "views/settings.html",
        controller: 'adminSettingsController'
    })

    .state('verify', {
        url: "/verify/:token",
        templateUrl: 'views/verify.html',
        controller: 'verifyController',
        data: {
            login: false
         }
    })

    .state('reset', {
        url: "/reset/:token",
        templateUrl: "views/reset.html",
        controller: 'resetController',
        data: {
          requireLogin: false
        }
      })

    .state('404', {
        url: "/404",
        templateUrl: 'views/404.html',
        data: {
            login: false
         }
    })

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}])
.run($transitions => {
    $transitions.onStart({}, transition => {
        const Session = transition.injector().get("Session");

        var requireLogin = transition.to().data.login;
        var requireVerified = transition.to().data.verified;
        var requireAdmin = transition.to().data.admin;
        var requireAccepted = transition.to().data.accepted;

        // if logged in, go to dashboard
        if (transition.to().name === 'login' && Session.getToken()) {
            return transition.router.stateService.target("app.dashboard");
        }

        if (transition.to().name === 'register' && Session.getToken()) {
            return transition.router.stateService.target("app.dashboard");
        }

        if (transition.to().name === 'forgot' && Session.getToken()) {
            return transition.router.stateService.target("app.dashboard");
        }

        // check if user logged in
        if (requireLogin && !Session.getToken()) {
            return transition.router.stateService.target("login");
        }
        
        // check if user is verified or not
        // problem here with to get access to page by changing local storage value
        // but should be okay since actions still checks permission 
        if (requireVerified && !Session.getUser().status.verified) {
            return transition.router.stateService.target("app.dashboard");
        }

        // check for admin status
        if (requireAdmin && !Session.getUser().admin) {
            return transition.router.stateService.target("app.dashboard");
        }

        if (requireAccepted && (!Session.getUser().status.accepted || Session.getUser().status.declined)) {
            return transition.router.stateService.target("app.dashboard");
        }

    });

    $transitions.onSuccess({}, transition => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
})