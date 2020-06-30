angular.module('app')
    .controller('loginController', ['$scope', 'AuthService', function($scope, AuthService){

        function onError(data){
            $scope.error = data.message;
        }

        $scope.login = function(){
            $scope.error = null;
            AuthService.passwordLogin($scope.email, $scope.password, onError);
        };

    }])