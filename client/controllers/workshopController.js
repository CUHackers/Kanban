angular.module('app')
    .controller('workshopController', ['$scope', 'currentUser', 'AuthService', function($scope, currentUser, AuthService){

        $scope.user = currentUser.data;

        isAdmin = false //haven't implemented actual admin check yet so user is never admin

        $scope.create = function(){
            //Do create things
        }

        $scope.remove = function(){
            //Do remove things
        }

        $scope.signUp = function(){
            //Sign up stuff
        }

        $scope.optOut = function(){
            //Opt out stuff
        }

        $scope.view = function(){
            //view stuff
        }
    }])