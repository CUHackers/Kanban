angular.module('app')
    .controller('confirmationController', ['$scope', 'currentUser', 'UserService', '$state',
     function($scope, currentUser, UserService, $state) {

        var user = currentUser.data;
        $scope.user = user;
        $scope.confStatus = $scope.user.status.confirmed;


        // a little hack to sure optional fields will exist if textarea/input not clicked
        function optionalCheck(data) {
            if (!data){
                data = "";
            }
        }

        optionalCheck($scope.user.confirmation.address.street);
        optionalCheck($scope.user.confirmation.address.apartNum);
        optionalCheck($scope.user.confirmation.address.city);
        optionalCheck($scope.user.confirmation.address.state);
        optionalCheck($scope.user.confirmation.address.zip);

        $scope.submitConf = function(){
            UserService.updateConf(user.id, $scope.user.confirmation).then(function(res){
                $state.reload();
                $scope.confStatus = true;
            });
        };

        $scope.view = function(){
            $scope.confStatus = false;
        }

        $scope.back = function(){
            $scope.confStatus = true;
        }
    }])