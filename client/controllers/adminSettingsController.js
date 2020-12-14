var swal = require('sweetalert');

angular.module('app')
    .controller('adminSettingsController', ['$scope', 'SettingsService',
     function($scope, SettingsService){

        $scope.settings = {};

        SettingsService.getTime().then(res => {
            $scope.settings.timeClose = new Date(res.data.timeClose);
        });

        $scope.formatDate = function(time) {
            if (time) {
              return new Date(time).toLocaleDateString(
                'en-US'
              );
            }
        }

        $scope.updateTimes = function() {
            let close = $scope.settings.timeClose.getTime();

            if ( close < 0 ||  close === undefined){
                return swal('Error', 'You need to enter a valid time.', 'error');
            }
      
            SettingsService.updateTimes(close)
                .then(res => {
                    $scope.settings.timeClose = new Date(res.data.timeClose);
                    swal("Success", "Registration Close Times Updated", "success");
                });
        }

    }])