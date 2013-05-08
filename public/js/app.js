'use strict';

// Declare app level module which depends on filters, and services
angular.module('cfadmin', ['cfadminServices', 'ui.bootstrap.pagination']).
  config(function($routeProvider) {
      $routeProvider.
        when('/list', { controller:UserListCtrl, templateUrl: '/partial/users-list'}).
        when('/create', { controller:UserCreateCtrl, templateUrl: '/partial/users-create'}).
        otherwise({redirectTo:'/list'});
    });