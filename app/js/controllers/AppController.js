define([
  // Standard Libs
  'Console'    // lib/console/console
  , 'routes/routes'
], function (Console,routes) {
  "use strict";

  var appController = ['$scope','$location',function ($scope, $location) {
    Console.group("AppController entered");
    $scope.navigation = routes;
    $scope.$location = $location;

    Console.groupEnd();// .controller
  }];

  return appController;
});
