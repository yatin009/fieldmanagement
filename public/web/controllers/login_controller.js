var fieldManagementModule = angular.module("fieldManagement");

fieldManagementModule.controller("LoginController", function ($scope,Account, $http, $state) {
    var url = "http://localhost:3000/";
    $scope.isWrongCredential = false;
    $scope.verifyUser = function (username, password) {

        // $http.post(url + "login_user", {username: username, password: password})
        //     .then(function successCallback(res) {
        //         console.log(res);
        //         if (res.status === 200) {
        //             console.log(res.data);
        //             // window.location.href = url+'dashboard';
        //             // $http.post(url+'dashboard', res.data);
        //
        //         }
        //     }, function errorCallback(err){
        //         console.log(err)
        //     });

        if(password == "1234"){
            $scope.isLoginSuccessful = false;
            Account.setUserDetails({username : username, password:password});
            Account.setIsAuthenticated(true);
            $state.go("dashboard");
        } else {
            Account.setUserDetails(null);
            Account.setIsAuthenticated(false);
            $scope.isLoginSuccessful = true;
        }
    };

    $scope.registerUser = function (username, password, email) {
        $http.post(url + "register_user", {username: username, password: password, email: email}).then(function successCallback(res){
            animateToogle();
        }, function errorCallback(err){
            console.log(err)
        });
    };

    $scope.animateForm = function(){
        animateToogle();
    };

    function animateToogle() {
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    }
});