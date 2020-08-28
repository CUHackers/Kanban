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

        /**
         * gets users based on the query text and filter
         * @param {String} query the query text
         * @param {String} filter the search filter
         */
        userService.getUsers = function(query, filter) {
            return $http.get('/api/users?' + $.param(
                {
                  query: query,
                  filter: filter
                })
            );
        }

        /**
         * assign RFID to an user adn check in 
         * @param {String} id uid of user
         */
        userService.assignID = function(id, rfid) {
            return $http.post('/api/users/' + id + '/assign', {
                rfid: rfid
            });
        }

        userService.checkin = function(rfid) {
            return $http.post('/api/users/checkin', {
                rfid: rfid
            });
        }

        return userService;

    }])