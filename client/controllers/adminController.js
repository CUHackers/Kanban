angular.module('app')
    .controller('adminController', ['$scope', '$location', 'currentUser', 'UserService', 'Session', 
     function($scope, $location, currentUser, UserService, Session){

        $scope.user = currentUser.data;

    }])