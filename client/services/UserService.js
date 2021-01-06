var json2csv = require('json2csv').parse;

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
         * updates user confirmation
         * @param {String} id user id
         * @param {Object} conf user confirmation form
         */
        userService.updateConf = function(id, conf) {
            return $http.put('/api/users/' + id + '/confirmation', {
                conf: conf
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

        /**
         * check in/ check out user for rfid
         * @param {String} rfid 
         */
        userService.checkin = function(rfid) {
            return $http.post('/api/users/checkin', {
                rfid: rfid
            });
        }

        /**
         * accepts user to the hackathon
         * @param {String} id user uid 
         */
        userService.accpetUser = function(id) {
            return $http.post('/api/users/' + id + '/accept');
        }

        /**
         * declines admission for hackathon
         * @param {String} id uid 
         */
        userService.decline = function(id) {
            return $http.post('/api/users/' + id + '/decline');
        }

        userService.exportCSV = function(data) {
            var filename = 'cuhackit_users.csv'
            var fields = ['info.name', 'email','info.major','info.sex','info.race'];
            var csv;
            try {
                csv = json2csv(data, {fields});
            }
            catch (err) {
                return res.status(500).send(err);
            }
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });
            link.dispatchEvent(clickEvent);
        }

        return userService;

    }])
