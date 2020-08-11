angular.module('app')
    .controller('sidebarController', ['$scope', '$rootScope', 'AuthService',
     function($scope, $rootScope, AuthService){

        $scope.user = $rootScope.currentUser;

        $scope.logout = function(){
            AuthService.logout();
        };

    }])