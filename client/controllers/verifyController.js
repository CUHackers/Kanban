angular.module('app')
    .controller('verifyController', ['$scope', '$rootScope', '$stateParams', 'AuthService',
     function($scope, $rootScope, $stateParams, AuthService){

        var token = $stateParams.token;

        $scope.loading = true;

        if (token) {
            AuthService.verify(token, function(res) {
                if (res) {
                    $rootScope.currentUser = res.data;
                    $scope.verify = true;
                    $scope.loading = false;
                }
                else {
                    $scope.loading = false;
                }
            })
        }

    }])