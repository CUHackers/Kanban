angular.module('app')
    .controller('registerController', ['$scope', 'AuthService', '$state',
    function($scope, AuthService, $state){

        function onSucess(){
            $state.go('app.dashboard');
        }

        function onError(data){
            $scope.error = data.message;
        }

        $scope.register = function(){
            $scope.error = null;
            AuthService.register($scope.info.email, $scope.info.password, onSucess, onError);
        };


    }])