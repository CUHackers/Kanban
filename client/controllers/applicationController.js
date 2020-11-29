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

        optionalCheck($scope.user.info.address.street);
        optionalCheck($scope.user.info.address.apartNum);
        optionalCheck($scope.user.info.address.city);
        optionalCheck($scope.user.info.address.state);
        optionalCheck($scope.user.info.address.zip);
        optionalCheck($scope.user.info.frq1);
        optionalCheck($scope.user.info.frq2);
        optionalCheck($scope.user.info.frq3);

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