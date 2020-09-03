angular.module('app')
    .controller('sidebarController', ['$scope', '$rootScope', 'AuthService', '$state',
     function($scope, $rootScope, AuthService, $state){

        $scope.user = $rootScope.currentUser;

        $scope.isAdminStateActive = function(state) {
            return $state.includes(state);
        }

        $scope.logout = function(){
            AuthService.logout();
        };

        $scope.showSidebar = false;
        $scope.toggleSidebar = function(){
            $scope.showSidebar = !$scope.showSidebar;
            console.log($scope.showSidebar)
        };

    }])