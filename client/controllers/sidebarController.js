angular.module('app')
    .controller('sidebarController', ['$scope', '$rootScope', '$location', 'AuthService',
     function($scope, $rootScope, $location, AuthService){

        $scope.user = $rootScope.currentUser;

        $scope.logout = function(){
            AuthService.logout();
        };

    }])