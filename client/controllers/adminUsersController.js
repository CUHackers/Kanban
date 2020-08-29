var moment = require('moment');
var swal = require('sweetalert');

angular.module('app')
    .controller('adminUsersController', ['$scope', 'UserService',
     function($scope, UserService){

        $scope.users = [];
        $scope.selectedUser = {};

        $('.ui.dimmer').remove();
        $scope.selectedUser.sections = generateSections({status: '', info: ''});

        function updateTable(data){
            $scope.users = data;
        }

        // query for the user table, watches the search input
        $scope.$watch('queryText', function(queryText){
            UserService.getUsers(queryText, $scope.filter).then(res => {
                updateTable(res.data);
            });
        });

        // modal system based on quill
        $scope.selectUser = function (user){
            $scope.selectedUser = user;
            $scope.selectedUser.sections = generateSections(user);
            $('.long.user.modal').modal('show');
        }

        // accepts users
        $scope.accpetUser = function($event, user, index) {
            $event.stopPropagation();

            if (!user.status.acceptance) {
                swal({
                    title: "Warning",
                    text: "Are you sure you want to accept this user",
                    icon: "warning",
                })
                .then(value => {
                    if (!value) {
                      return;
                    }

                    UserService.accpetUser(user.id).then(res => {
                        $scope.users[index].status.acceptance = res.data.status.acceptance;
                        swal("Accepted", res.data.info.name + ' has been Accepted.', "success");
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
                    text: "User already accepted",
                    icon: "warning",
                })
            }
        }

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
                        $scope.users[index].status.checkin = res.data.status.checkin;
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

        function formatTime(time){
            if (time) {
              return moment(time).format('MMMM Do YYYY, h:mm:ss a');
            }
        }

        function generateSections(user){
            return [
                {
                    name: 'Status',
                    fields: [
                        {
                            name: 'Verified',
                            value: user.status.verify,
                            type: 'boolean'
                        },
                        {
                            name: 'Completed Application',
                            value: user.status.application,
                            type: 'boolean'
                        },
                        {
                            name: 'Accepted',
                            value: user.status.acceptance,
                            type: 'boolean'
                        },
                        {
                            name: 'Checked In',
                            value:  user.status.checkin,
                            type: 'boolean'
                        }
                    ]
                },
                {
                    name: 'Basic Info',
                    fields: [
                        {
                            name: 'Created On',
                            value: formatTime(user.createdAt)
                        },
                        {
                            name: 'Last Updated',
                            value: formatTime(user.updatedAt)
                        },
                        {
                            name: 'RFID',
                            value:  user.rfid || 'Not Assigned'
                        },
                        {
                            name: 'Email',
                            value: user.email
                        }
                    ]
                },
                {
                    name: 'Application Info',
                    fields: [
                        {
                            name: 'Name',
                            value: user.info.name
                        },
                        {
                            name: 'CUID',
                            value: user.info.cuid
                        },
                        {
                            name: 'First Semester At Clemson',
                            value: user.info.first
                        },
                        {
                            name: 'Gender Pronouns',
                            value: user.info.pronouns
                        },
                        {
                            name: 'Race/Ethnicity',
                            value: user.info.race
                        },
                        {
                            name: 'Number of Teammates',
                            value: user.info.teammates
                        },
                        {
                            name: 'Programming Experience',
                            value: user.info.experience
                        },
                        {
                            name: 'Discord Account?',
                            value: user.info.discord
                        },
                        {
                            name: 'Why do you want to participate?',
                            value: user.info.frq1
                        },
                        {
                            name: 'Do you have any video tutorial suggestions that we can prepare for you?',
                            value: user.info.frq2
                        },
                        {
                            name: 'What kind of project do you have in mind?',
                            value: user.info.frq3
                        },
                        {
                            name: 'What vegetable are you?',
                            value: user.info.frq4
                        },
                        {
                            name: 'Is there anything we should know?',
                            value: user.info.frq5
                        }
                        
                    ]
                }
            ];
        }

    }])