angular.module('app')
    .controller('adminCheckInController', ['$scope', 'UserService',
     function($scope, UserService){

        // checks in/out an user based on the rfid
        $scope.checkin = function(){
            var rfid = $scope.rfid;

            if (rfid) {
                UserService.checkin(rfid).then(res => {
                    $scope.rfid = null;
                    if (res.data.status.checkin) {
                        swal("Checked In", res.data.info.name + " has been checked in.", "success");
                    }
                    else {
                        swal("Checked Out", res.data.info.name + " has been checked out.", "success");
                    }
                })
                .catch(err => {
                    $scope.rfid = null;
                    swal("Oh noes!", err.data.message, "error");
                });
            }
        }

    }])