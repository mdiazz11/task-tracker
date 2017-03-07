var module = angular.module('taskTracker', ['ui.router']);

module.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/taskList');
});
