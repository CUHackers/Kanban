angular.module('app')
    .controller('sidebarController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){

        $scope.isRouteActive = function(route) { 
            return route === $location.path();
        }

        $scope.logout = function(){
            AuthService.logout();
        };

    }])