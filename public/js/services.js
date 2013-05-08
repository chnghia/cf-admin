'use strict';
/* Services */

angular.module('cfadminServices', ['ngResource']).
  factory('User', function($resource) {
  	return $resource('api/users/:userId.json', {}, {
    	query: {method:'GET', params:{userId:'users'}, isArray:true}
    });
});
