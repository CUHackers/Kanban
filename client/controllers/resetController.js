angular.module('app')
    .controller('resetController', ['$scope', '$stateParams', '$state', 'AuthService',
     function($scope, $stateParams, $state, AuthService){

        var token = $stateParams.token;

        $scope.changePassword = function() {
            var password = $scope.password;
            var confirm = $scope.confirm;

            if (password !== confirm){
                $scope.error = "Passwords don't match!";
                $scope.confirm = "";
                return;
            }

            AuthService.resetPassword(token, $scope.password, success => {
                swal("Success!", "Your password has been changed!", "success").then(value => {
                    $state.go("login");
                });
            },
                err => {
                    $scope.error = err.data.message;
                }
            );
        }

    }])