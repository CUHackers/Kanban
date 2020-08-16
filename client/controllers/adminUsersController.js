angular.module('app')
    .controller('adminUsersController', ['$scope', 'UserService',
     function($scope, UserService){

        $scope.users = [];

        function updateTable(data){
            $scope.users = data;
        }

        // query for the user table, watches the search input
        $scope.$watch('queryText', function(queryText){
            UserService
              .getUsers(queryText, $scope.filter)
              .then(response => {
                    updateTable(response.data);
              });
          });

        // assign rfid 
        $scope.assignID = function($event, user, index) {
            $event.stopPropagation();

            if (!user.rfid) {
                swal({
                    text: 'Scan the RFID',
                    content: "input",
                    button: {
                      text: "Enter!",
                      closeModal: false,
                    },
                })
                .then(rfid => {
                    if (!rfid) throw null;

                    // assign RFID not uid
                    UserService.assignID(user.id, rfid).then(res => {
                        $scope.users[index].rfid = res.data.rfid;
                        swal("Accepted", res.data.info.name + " has been checked in.", "success");
                    })
                    .catch(err => {
                        if (err) {
                            swal("Oh noes!", err.data.message, "error");
                        }
                        else {
                            swal.stopLoading();
                            swal.close();
                        }
                    });
                })
            }
            else {
                swal({
                    title: "Error!",
                    text: "User already have a RFID assigned to him/her",
                    icon: "warning",
                })
            }
        }

    }])