'use strict';

/* Controllers */

function CfAdminCtl($scope, $http) {
  $http({method: 'GET', url: '/api/first'}).
  success(function(data, status, headers, config) {
    $scope.title = data.first;
  }).
  error(function(data, status, headers, config) {
    $scope.title = 'Error!'
  });
}

/*
angular.module('cfadmin', []).factory( 'myData', function(User) {
  var data = User.query();
  
  // push some dummy data
  for(var i = 0; i < 30; i++) {
    data.push( { first: "item"+i } );
  }
  
  return {
    get: function(offset, limit) {
      return data.slice( offset, offset+limit );
    },
    count: function() {
      return data.length;
    }
  };
});
*/

function UserListCtrl($scope, $filter, User) {
  //$scope.users = User.query();
  // init
  $scope.sortingOrder = sortingOrder;
  $scope.reverse = false;
  $scope.filteredItems = [];
  $scope.groupedItems = [];
  $scope.itemsPerPage = 5;
  $scope.pagedItems = [];
  $scope.currentPage = 0;
  /*$scope.items = [
      {"id":"1","first":"first 1","last":"last 1","username":"username 1","field4":"field4 1","field5 ":"field5 1"}, 
      {"id":"2","first":"first 2","last":"last 1","username":"username 2","field4":"field4 2","field5 ":"field5 2"}, 
      {"id":"3","first":"first 3","last":"last 1","username":"username 3","field4":"field4 3","field5 ":"field5 3"}, 
      {"id":"4","first":"first 4","last":"last 1","username":"username 4","field4":"field4 4","field5 ":"field5 4"}, 
      {"id":"5","first":"first 5","last":"last 1","username":"username 5","field4":"field4 5","field5 ":"field5 5"}, 
      {"id":"6","first":"first 6","last":"last 1","username":"username 6","field4":"field4 6","field5 ":"field5 6"}, 
      {"id":"7","first":"first 7","last":"last 1","username":"username 7","field4":"field4 7","field5 ":"field5 7"}, 
      {"id":"8","first":"first 8","last":"last 1","username":"username 8","field4":"field4 8","field5 ":"field5 8"}, 
      {"id":"9","first":"first 9","last":"last 1","username":"username 9","field4":"field4 9","field5 ":"field5 9"}, 
      {"id":"10","first":"first 10","last":"last 1","username":"username 10","field4":"field4 10","field5 ":"field5 10"}, 
      {"id":"11","first":"first 11","last":"last 1","username":"username 11","field4":"field4 11","field5 ":"field5 11"}, 
      {"id":"12","first":"first 12","last":"last 1","username":"username 12","field4":"field4 12","field5 ":"field5 12"}, 
      {"id":"13","first":"first 13","last":"last 1","username":"username 13","field4":"field4 13","field5 ":"field5 13"}, 
      {"id":"14","first":"first 14","last":"last 1","username":"username 14","field4":"field4 14","field5 ":"field5 14"}, 
      {"id":"15","first":"first 15","last":"last 1","username":"username 15","field4":"field4 15","field5 ":"field5 15"}, 
      {"id":"16","first":"first 16","last":"last 1","username":"username 16","field4":"field4 16","field5 ":"field5 16"}, 
      {"id":"17","first":"first 17","last":"last 1","username":"username 17","field4":"field4 17","field5 ":"field5 17"}, 
      {"id":"18","first":"first 18","last":"last 1","username":"username 18","field4":"field4 18","field5 ":"field5 18"}, 
      {"id":"19","first":"first 19","last":"last 1","username":"username 19","field4":"field4 19","field5 ":"field5 19"}, 
      {"id":"20","first":"first 20","last":"last 1","username":"username 20","field4":"field4 20","field5 ":"field5 20"}
  ];*/

  var searchMatch = function (haystack, needle) {
      if (!needle) {
          return true;
      }
      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
  };

  // init the filtered items
  $scope.search = function () {
      $scope.users = User.query({q: $scope.query}, function(){
        // $scope.filteredItems = $filter('filter')($scope.users, function (item) {
        //     for(var attr in item) {
        //         if (searchMatch(item[attr], $scope.query))
        //             return true;
        //     }
        //     return false;
        // });
        $scope.filteredItems = $scope.users;

        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
      });
  };
  
  // calculate page in place
  $scope.groupToPages = function () {
      $scope.pagedItems = [];
      
      for (var i = 0; i < $scope.filteredItems.length; i++) {
          if (i % $scope.itemsPerPage === 0) {
              $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
          } else {
              $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
          }
      }
  };
  
  $scope.range = function (start, end) {
      var ret = [];
      if (!end) {
          end = start;
          start = 0;
      }
      for (var i = start; i < end; i++) {
          ret.push(i);
      }
      return ret;
  };
  
  $scope.prevPage = function () {
      if ($scope.currentPage > 0) {
          $scope.currentPage--;
      }
  };
  
  $scope.nextPage = function () {
      if ($scope.currentPage < $scope.pagedItems.length - 1) {
          $scope.currentPage++;
      }
  };
  
  $scope.setPage = function () {
      $scope.currentPage = this.n;
  };

  // functions have been describe process the data for display
  $scope.search();

  // change sorting order
  $scope.sort_by = function(newSortingOrder) {
      if ($scope.sortingOrder == newSortingOrder)
          $scope.reverse = !$scope.reverse;

      $scope.sortingOrder = newSortingOrder;

      // icon setup
      $('th i').each(function(){
          // icon reset
          $(this).removeClass().addClass('icon-sort');
      });
      if ($scope.reverse)
          $('th.'+newSortingOrder+' i').removeClass().addClass('icon-caret-up');
      else
          $('th.'+newSortingOrder+' i').removeClass().addClass('icon-caret-down');
  };

  $scope.createUser = function () {
  }
}

function UserCreateCtrl($scope, User) {
}