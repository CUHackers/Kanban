angular.module('app').
    factory('UserService', ['$http', 'Session', function ($http, Session){ 
        var userService = {};
        
        /**
         * get the current user using id
         */
        userService.getCurrentUser = function() {
            return $http.get('/api/users/' + Session.getID());
        }

        /**
         * updates user info 
         * @param {String} id user id
         * @param {Object} info basic registration info
         */
        userService.updateInfo = function(id, info) {
            return $http.put('/api/users/' + id + '/info', {
                info: info
              });
        }
        return userService;


    }])