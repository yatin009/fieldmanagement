var fieldManagementModule = angular.module("fieldManagement");

fieldManagementModule.controller("DashboardController", function ($scope, $state, Account, $timeout) {

    console.log(Account.isAuthenticated());
    console.log(Account.getUserDetails());
    if(!Account.isAuthenticated()){
        $state.go("login");

    } else {
        $scope.userDetails = Account.getUserDetails();
    }
    $timeout( function(){
        $(".successfull-login").animate({opacity : 0}, 3000);

        $timeout( function(){
            $scope.welcome_dashboard = true;
            $timeout( function(){
                $(".welcome-dashboard").animate({opacity : 1}, 3000);
            }, 10 );
        }, 3000 );
    }, 1500 );


});