angular.module('app')
    .controller('registerController', ['$scope', 'AuthService', 'UserService', 'Session', '$state',
    function($scope, AuthService, UserService, Session, $state){

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

        function onSucess(data){
            UserService.updateInfo(Session.getID(), $scope.info, false).then(function(res){
                $state.go('app.dashboard');
            });
        }

        function onError(data){
            $scope.error = data.message;
        }

        $scope.register = function(){
            $scope.error = null;
            $scope.info.frq1 = "";
            $scope.info.frq2 = "";
            AuthService.register($scope.info.email, $scope.info.password, onSucess, onError);
        };


    }])