angular.module('app')
    .controller('verifyController', ['$scope', 'Session', '$stateParams', 'AuthService',
     function($scope, Session, $stateParams, AuthService){

        var token = $stateParams.token;

        $scope.loading = true;

        if (token) {
            AuthService.verify(token, function(res) {
                if (res) {
                    Session.setUser(res.data);
                    $scope.verify = true;
                    $scope.loading = false;
                }
                else {
                    $scope.loading = false;
                }
            })
        }

    }])