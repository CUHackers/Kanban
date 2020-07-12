angular.module('app')
    .controller('verifyController', ['$scope', '$routeParams', 'AuthService', function($scope, $routeParams, AuthService){

        var token = $routeParams.token;

        $scope.loading = true;

        if (token) {
            AuthService.verify(token, function(res) {
                if (res) {
                    $scope.verify = true;
                    $scope.loading = false;
                }
                else {
                    $scope.loading = false;
                }
            })
        }

    }])