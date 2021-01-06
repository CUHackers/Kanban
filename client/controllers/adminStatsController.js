angular.module('app')
    .controller('adminStatsController', ['$scope', 'UserService',
     function($scope, UserService){

        $scope.users = [];
        $scope.stats = {
            total: 0,
            unverified: 0,
            verified: 0,
            incompleteApp: 0,
            completedApp: 0,
            accepted: 0,
            sex: {
                male: 0,
                female: 0,
                other: 0,
            },
            level: {
                freshman: 0,
                sophomore: 0,
                junior: 0,
                senior: 0,
                grad: 0
            },
            shirt: {
                s: 0,
                m: 0,
                l: 0,
                xl: 0,
                xxl: 0
            },
            events: {
                aws: 0,
                microsoft: 0,
                splunk: 0,
                softdocs: 0,
                bluecross: 0,
                ctf: 0
            }
        }

        // get all users
        UserService.getUsers('', '').then(res => {
            $scope.users = res.data;

            for (user of $scope.users ) {
                // status 
                $scope.stats.total += 1;
                $scope.stats.unverified += (!user.status.verified) ? 1 : 0;
                $scope.stats.verified += (user.status.verified) ? 1 : 0;
                $scope.stats.incompleteApp += (user.status.verified && !user.status.completedApp) ? 1 : 0;
                $scope.stats.completedApp += (user.status.verified && user.status.completedApp) ? 1 : 0;
                $scope.stats.accepted += (user.status.accepted && user.status.completedApp) ? 1 : 0;

                // sex 
                if (user.info.sex === 'Male') {
                    $scope.stats.sex.male += 1; 
                }
                else if (user.info.sex === 'Female') {
                    $scope.stats.sex.female += 1; 
                }
                else if (user.info.sex === 'Other/Perfer not to say') {
                    $scope.stats.sex.other += 1; 
                }

                // grade level
                if (user.info.level === 'freshman') {
                    $scope.stats.level.freshman += 1; 
                }
                else if (user.info.level === 'sophomore') {
                    $scope.stats.level.sophomore += 1; 
                }
                else if (user.info.level === 'junior') {
                    $scope.stats.level.junior += 1; 
                }
                else if (user.info.level === 'senior') {
                    $scope.stats.level.senior += 1; 
                }
                else if (user.info.level === 'grad student') {
                    $scope.stats.level.grad += 1; 
                }

                // shirt size 
                if (user.info.shirt === 'S') {
                    $scope.stats.shirt.s += 1; 
                }
                else if (user.info.shirt === 'M') {
                    $scope.stats.shirt.m += 1; 
                }
                else if (user.info.shirt === 'L') {
                    $scope.stats.shirt.l += 1; 
                }
                else if (user.info.shirt === 'XL') {
                    $scope.stats.shirt.xl += 1; 
                }
                else if (user.info.shirt === 'XXL') {
                    $scope.stats.shirt.xxl += 1; 
                }

                // events
                $scope.stats.events.aws += (user.info.recruiter.aws) ? 1 : 0;
                $scope.stats.events.bluecross += (user.info.recruiter.bluecross) ? 1 : 0; 
                $scope.stats.events.microsoft += (user.info.recruiter.microsoft) ? 1 : 0; 
                $scope.stats.events.softdocs += (user.info.recruiter.softdocs) ? 1 : 0; 
                $scope.stats.events.splunk += (user.info.recruiter.splunk) ? 1 : 0; 
                $scope.stats.events.ctf += (user.info.ctf == 'true') ? 1 : 0; 
            }
        });


    }])