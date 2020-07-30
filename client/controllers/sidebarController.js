angular.module('app')
    .controller('sidebarController', ['$scope', '$rootScope', '$location', 'AuthService',
     function($scope, $rootScope, $location, AuthService){

        $scope.user = $rootScope.currentUser;

        $scope.isRouteActive = function(route) { 
            return route === $location.path();
        }

        $scope.link = function(link) {
            $location.path(link);
        }

        $scope.logout = function(){
            AuthService.logout();
        };

    }])