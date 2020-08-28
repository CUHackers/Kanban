angular.module('app')
    .controller('applicationController', ['$scope', '$state', 'currentUser', 'UserService', 'Session', 
     function($scope, $state, currentUser, UserService, Session){

        $scope.user = currentUser.data;
        $scope.appStatus = $scope.user.status.application

        // since frq5 is optional, a little hack to sure frq5 will be in info if textarea not clicked
        if (!$scope.user.info.frq5) {
            $scope.user.info.frq5 = "";
        }

        $scope.submitApp = function(){
            UserService.updateInfo(Session.getID(), $scope.user.info).then(function(res){
                $scope.appStatus = true;
            });
        };

        $scope.edit = function(){
            $scope.appStatus = false;
        }

    }])