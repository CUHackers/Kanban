angular.module('app')
    .controller('verifyController', ['$scope', '$stateParams', 'AuthService', function($scope, $stateParams, AuthService){

        var token = $stateParams.token;

        $scope.loading = true;

        if (token) {
            AuthService.verify(token, function(res) {
                if (res) {
                    $scope.verify = true;
                    $scope.loading = false;
                    console.log("done")
                }
                else {
                    $scope.loading = false;
                }
            })
        }

    }])