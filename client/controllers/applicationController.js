angular.module('app')
    .controller('applicationController', ['$scope', 'currentUser', 'UserService', '$state',
     function($scope, currentUser, UserService, $state){

        var user = currentUser.data;
        $scope.user = user;
        $scope.appStatus = $scope.user.status.completedApp

        // a little hack to sure optional fields will exist if textarea/input not clicked
        function optionalCheck(data) {
            if (!data){
                data = "";
            }
        }

        optionalCheck($scope.user.info.frq5);
        optionalCheck($scope.user.info.frq6);

        $scope.submitApp = function(){
            UserService.updateInfo(user.id, $scope.user.info).then(function(res){
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