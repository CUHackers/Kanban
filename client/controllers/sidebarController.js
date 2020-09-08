angular.module('app')
    .controller('sidebarController', ['$scope', '$rootScope', 'AuthService', '$state',
     function($scope, $rootScope, AuthService, $state){

        $scope.user = $rootScope.currentUser;
        $scope.showSidebar = false;

        $scope.isAdminStateActive = function(state) {
            return $state.includes(state);
        }

        $scope.logout = function(){
            AuthService.logout();
        };

        $scope.toggleSidebar = function(){
            $scope.showSidebar = !$scope.showSidebar;
        };

        // ng-click and ui-sref dont like each other, thanks for the hack quill
        $('.option').on('click', function(){
            $scope.showSidebar = false;
        });

        $('.logo').on('click', function(){
            $scope.showSidebar = false;
        });

    }])