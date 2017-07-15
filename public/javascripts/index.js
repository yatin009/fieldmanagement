var loginModule = angular.module("loginModule", [])

loginModule.controller("LoginCtrl", function ($http, $state) {
    var app = this;
    var url = "http://localhost:3000/";

    app.verifyUser = function (username, password) {
        $http.post(url + "login_user", {username: username, password: password})
            .then(function successCallback(res) {
            console.log(res);
            if (res.status === 200) {
                console.log(res.data);
                // window.location.href = url+'dashboard';
                // $http.post(url+'dashboard', res.data);
                $state.go("dashboard")
            }
        }, function errorCallback(err){
            console.log(err)
        });
    };

    app.registerUser = function (username, password, email) {
        $http.post(url + "register_user", {username: username, password: password, email: email}).then(function successCallback(res){
            animateToogle();
        }, function errorCallback(err){
            console.log(err)
        });
    };

    app.animateForm = function(){
        animateToogle();
    };

    function animateToogle() {
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    }
});