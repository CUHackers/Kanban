angular.module('app')
    .controller('adminUsersController', ['$scope', 'UserService',
     function($scope, UserService){

        $scope.users = [];

        function updateTable(data){
            $scope.users = data;
        }

        $scope.$watch('queryText', function(queryText){
            UserService
              .getUsers(queryText, $scope.filter)
              .then(response => {
                    updateTable(response.data);
              });
          });

    }])