angular.module('app')
    .controller('applicationController', ['$scope', 'currentUser', 'UserService', 'Session', '$state',
     function($scope, currentUser, UserService, Session, $state){

        $scope.user = currentUser.data;
        $scope.appStatus = $scope.user.status.completedApp

        // since frq5 is optional, a little hack to sure frq5 will be in info if textarea not clicked
        if (!$scope.user.info.frq5) {
            $scope.user.info.frq5 = "";
        }

        $scope.submitApp = function(){
            UserService.updateInfo(Session.getID(), $scope.user.info).then(function(res){
                $state.reload();
                $scope.appStatus = true;
            });
        };

        $scope.view = function(){
            $scope.appStatus = false;
        }

        $scope.back = function(){
            $scope.appStatus = true;
        }

    }])