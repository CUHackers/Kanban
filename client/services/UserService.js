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
         * @param {Boolean} app if called from completing applcation 
         */
        userService.updateInfo = function(id, info, app) {
            return $http.put('/api/users/' + id + '/info', {
                info: info,
                app: app
              });
        }
        return userService;


    }])