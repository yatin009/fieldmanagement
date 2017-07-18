var fieldManagementModule = angular.module("fieldManagement");

fieldManagementModule.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        templateUrl: "web/views/dashboard.html",
        url: "^/dashboard",
        controller : "DashboardController"
    });
});