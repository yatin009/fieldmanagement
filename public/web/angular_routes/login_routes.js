var fieldManagementModule = angular.module("fieldManagement");

fieldManagementModule.config(function ($stateProvider) {
    $stateProvider.state('login', {
        templateUrl: "web/views/login.html",
        url: "^/login",
        controller : "LoginController"
    });
});