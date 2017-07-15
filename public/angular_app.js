var fieldManagementModule = angular.module("fieldManagement", ['ngResource', 'ui.router']);

fieldManagementModule.controller("MainController", function ($scope, $http, $state) {
    $state.go("login");

})
    .config(function ($stateProvider) {
    $stateProvider.state('main', {
        url: "/",
        controller : "MainController"
    });
})
    .config(function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
})
    .service('Account', function ($resource) {
        var isAuthenticated;
        var userDetails;
        return {
            setUserDetails : function(newUserDetails){
                userDetails = newUserDetails;
            },
            getUserDetails: function () {
                return userDetails;
            },
            isAuthenticated: function () {
                return isAuthenticated;
            },
            setIsAuthenticated: function (authenticated) {
                isAuthenticated = authenticated;
            }
        };
});