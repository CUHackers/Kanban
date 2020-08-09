angular.module('app')
    .controller('applicationController', ['$scope', '$state', 'currentUser', 'UserService', 'Session', 
     function($scope, $state, currentUser, UserService, Session){

        $scope.user = currentUser.data;
        $scope.appStatus = $scope.user.status.application

        $scope.genders = [
            {value: '', display: 'Gender'},
            {value: 'male', display: 'Male'},
            {value: 'female', display: 'Female'},
            {value: 'other', display: 'Other'},
        ];

        $scope.year = [
            {value: '', display: 'Graduation Year'},
            {value: '2021', display: '2021'},
            {value: '2022', display: '2022'},
            {value: '2023', display: '2023'},
            {value: '2024', display: '2024'}
        ];

        $scope.submitApp = function(){
            UserService.updateInfo(Session.getID(), $scope.user.info, true).then(function(res){
                $scope.appStatus = true;
            });
        };

        $scope.edit = function(){
            $scope.appStatus = false;
        }

    }])