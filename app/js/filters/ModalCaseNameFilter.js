define([
    // Standard Libs
    'Console'// lib/console/console
    , 'Angular'    // lib/angular/angular
    ,'utils/localStorageUtil'
], function (Console,angular,localStorageUtil) {
  "use strict";
  Console.group("Entering ModalCaseNameFilter module.");

  var filter = ['$window', function ($window) {
      var db = $window.localStorage;

      return function(input, modal) {
          Console.group("Entering ModalCaseNameFilter module. input?" + input + " modal?" + modal);
          if(modal){
              if(angular.isString(input) && input.indexOf('p') == 0){
                  input = input.replace('p','');
              }
              var myData = localStorageUtil.getLocalStorageToObject(modal,db);
              var thisObject = myData['p' + input];
              if(thisObject){
                  return thisObject.caseName;
              }else{
                  return '';
              }
          }else{
              return '';
          }
          Console.groupEnd();
      }
  }];
  Console.groupEnd();
  return filter;
});
