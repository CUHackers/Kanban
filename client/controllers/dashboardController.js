var swal = require('sweetalert');

angular.module('app')
    .controller('dashboardController', ['$scope', 'currentUser', 'AuthService', function($scope, currentUser, AuthService){

        $scope.user = currentUser.data
        
        $scope.sendEmail = function(){
            AuthService.sendVerificationEmail().then(function(res){
                swal("verification email has been sent.");
            })
        };

    }])