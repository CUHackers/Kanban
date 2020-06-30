angular.module('app').
    factory('UserService', ['$http', function ($http){ 
        var userService = {};

        userService.updateInfo = function (id, info) {
            return $http.put('/api/users/' + id + '/info', {
                info: info
              });
        }
        return userService;


    }])