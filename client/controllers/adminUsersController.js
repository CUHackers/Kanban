var swal = require('sweetalert');

angular.module('app')
    .controller('adminUsersController', ['$scope', 'UserService',
     function($scope, UserService){

        $scope.users = [];
        $scope.selectedUser = {};

        $('.ui.dimmer').remove();
        $scope.selectedUser.sections = generateSections({status: '', info: {
                address: [],
                recruiter: []
            }});

        function updateTable(data){
            // different filter for accepted/verified users
            if ($scope.filter === 'accpeted') {
                data = data.filter(function(currUser) {
                    return currUser.status.accepted;
                });
                $scope.users = data;
            }
            else if ($scope.filter === 'verified') {
                data = data.filter(function(currUser) {
                    return currUser.status.verified;
                });
                $scope.users = data;
            }
            else if ($scope.filter === 'completedApp') {
                data = data.filter(function(currUser) {
                    return currUser.status.completedApp;
                });
                $scope.users = data;
            }
            else if ($scope.filter === 'incompleteApp') {
                data = data.filter(function(currUser) {
                    return currUser.status.verified && !currUser.status.completedApp;
                });
                $scope.users = data;
            }
            else {
                $scope.users = data;
            }
        }

        // query for the user table, watches the search input
        $scope.$watchGroup(['queryText','filter'], function(query){
            let queryText = query[0];
            let filter = query[1];
            if (filter === 'accepted' || filter === 'verified' || filter === 'completedApp'
             || filter === 'incompleteApp') {
                UserService.getUsers(queryText, null).then(res => {
                    updateTable(res.data);
                });
            }
            else {
                UserService.getUsers(queryText, filter).then(res => {
                    updateTable(res.data);
                });
            }
        });

        // modal system based on quill
        $scope.selectUser = function (user){
            $scope.selectedUser = user;
            $scope.selectedUser.sections = generateSections(user);
            $('.long.user.modal').modal('show');
        }

        $scope.exportCSV = function() {
            UserService.exportCSV($scope.users);
        }

        $scope.getStatus = function(status) {
            if (!status.verified) {
                return 'Unverified'
            }
            else if (status.verified && !status.completedApp) {
                return 'Incomplete Application'
            }
            else if (status.completedApp && !status.accepted) {
                return 'Completed Application'
            }
            else if (status.accepted && !status.confirmed && !status.declined) {
                return 'Accepted'
            }
            else if (status.confirmed && !status.declined) {
                return 'Confirmed'
            }
            else if (status.declined && !status.confirmed) {
                return 'Declined'
            }
        }

        // accepts users
        $scope.accpetUser = function($event, user, index) {
            $event.stopPropagation();

            if (!user.status.accepted) {
                swal({
                    title: "Warning",
                    text: "Are you sure you want to accept this user",
                    icon: "warning",
                    button: {
                        text: "OK",
                        closeModal: false,
                    },
                })
                .then(value => {
                    if (!value) {
                      return;
                    }

                    UserService.accpetUser(user.id).then(res => {
                        $scope.users[index].status.accepted = res.data.status.accepted;
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
              return new Date(time).toLocaleString(
                'en-US'
              );
            }
        }

        function generateSections(user){
            return [
                {
                    name: 'Status',
                    fields: [
                        {
                            name: 'Verified',
                            value: user.status.verified,
                            type: 'boolean'
                        },
                        {
                            name: 'Completed Application',
                            value: user.status.completedApp,
                            type: 'boolean'
                        },
                        {
                            name: 'Accepted',
                            value: user.status.accepted,
                            type: 'boolean'
                        },
                        {
                            name: 'Confirmed',
                            value: user.status.confirmed,
                            type: 'boolean'
                        },
                        {
                            name: 'Declined',
                            value: user.status.declined,
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
                            name: 'Major',
                            value: user.info.major
                        },
                        {
                            name: 'Level of Study',
                            value: user.info.level
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
                            name: 'Programming Experience',
                            value: user.info.experience
                        },
                        {
                            name: 'Discord Account?',
                            value: user.info.discord
                        },
                        {
                            name: "Do you have any suggestions for workshops you'd like our sponsor AWS to host",
                            value: user.info.frq1
                        },
                        {
                            name: 'Do you have any activity requests for us during the event (e.g. Among Us, trivia)?',
                            value: user.info.frq2
                        },
                        {
                            name: 'Is there anything we should know?',
                            value: user.info.frq3
                        },
                        {
                            name: 'What vegetable are you?',
                            value: user.info.frq4
                        }
                    ]
                },
                {
                    name: 'Personal Info',
                    fields: [
                        {
                            name: 'T-shirt Size',
                            value: user.info.shirt
                        },
                        {
                            name: 'Street',
                            value: user.info.address.street + ' ' + user.info.address.apartNum
                        },
                        {
                            name: 'City',
                            value: user.info.address.city
                        },
                        {
                            name: 'State',
                            value: user.info.address.state
                        },
                        {
                            name: 'Zip Code',
                            value: user.info.address.zip
                        }
                    ]
                },
                {
                    name: 'Events',
                    fields: [
                        {
                            name: 'AWS Session',
                            value: user.info.recruiter.aws,
                            type: 'boolean'
                        },
                        {
                            name: 'Microsoft Session',
                            value: user.info.recruiter.microsoft,
                            type: 'boolean'
                        },
                        {
                            name: 'BlueCross BlueShield Session',
                            value: user.info.recruiter.bluecross,
                            type: 'boolean'
                        },
                        {
                            name: 'Softdocs Session',
                            value: user.info.recruiter.softdocs,
                            type: 'boolean'
                        },
                        {
                            name: 'Splunk Session',
                            value: user.info.recruiter.splunk,
                            type: 'boolean'
                        },
                        {
                            name: 'CTF Event',
                            value: user.info.ctf,
                            type: 'boolean'
                        }
                    ]
                },
            ];
        }

    }])