var swal = require('sweetalert');

angular.module('app')
    .controller('dashboardController', ['$scope', '$rootScope', 'currentUser', 'AuthService', 'UserService', 'settings',
     function($scope, $rootScope, currentUser, AuthService, UserService, settings){

        var user = currentUser.data;
        $scope.regIsClosed = Date.now() > settings.data.timeClose;
        $scope.user = user;

        
        $scope.sendEmail = function(){
            AuthService.sendVerificationEmail().then(function(res){
                swal("Verification email has been sent.");
            })
        };

        $scope.decline = function(){
            swal({
                title: "Warning",
                text: "Are you sure you want to decline your admission?",
                icon: "warning",
                button: {
                    cancel: {
                        text: "Cancel",
                        value: null,
                        visible: true
                    },
                    confirm: {
                        text: "Yes, I can't make it",
                        value: true,
                        visible: true,
                        className: "danger-button"
                    }
                },
            })
            .then(value => {
                if (!value) {
                  return;
                }

                UserService.decline(user.id).then(res => {
                    $rootScope.currentUser = res.data;
                    $scope.user = res.data;
                })
            })
        }

    }])