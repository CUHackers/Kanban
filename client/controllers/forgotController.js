angular.module('app')
    .controller('forgotController', ['$scope', 'AuthService',
     function($scope, AuthService) {

        $scope.sendResetEmail = function() {
            var email = $scope.email;
            if (email) {
                AuthService.sendResetEmail(email)
                swal("Success!", "Check your email to reset your password.", "success");
            }
        
        };

    }])