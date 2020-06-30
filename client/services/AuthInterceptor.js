angular.module('app').
    factory('AuthInterceptor', ['Session', function (Session) {
        return {
            request: function(config) {
                var token = Session.getToken();
                if(token){
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }
        };
    }]);