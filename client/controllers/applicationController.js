angular.module('app')
    .controller('applicationController', ['$scope', 'currentUser', 'AuthService', function($scope, currentUser, AuthService){

        $scope.user = currentUser.data;

    }])