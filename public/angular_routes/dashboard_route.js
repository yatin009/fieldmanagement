var loginModule = angular.module("loginModule", []);

loginModule.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        templateUrl: "/views/dashboard.html",
        url: "^/dash",
        parent: "main"
    })
});