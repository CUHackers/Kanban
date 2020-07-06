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