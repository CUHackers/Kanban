angular.module('app').
    factory('SettingsService', ['$http', function ($http){
        var settingsService = {};


        /**
         * get the registration open and close time
         */
        settingsService.getTime = function() {
            return $http.get('/api/settings');
        }

        settingsService.updateTimes = function(close) {
            return $http.put('/api/settings/' + 'times', {
                timeClose: close
            });
        }

        return settingsService;
    }])