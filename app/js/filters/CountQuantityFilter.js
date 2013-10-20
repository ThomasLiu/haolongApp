define([
    // Standard Libs
    'Console'// lib/console/console
    , 'Angular'    // lib/angular/angular
], function (Console,angular) {
  "use strict";
  Console.group("Entering CountQuantityFilter module.");

  var filter = function () {
      return function(input) {
          Console.group("Entering CountQuantityFilter module. input",input);
          if(input && isArray(input)){
              var count = 0;
              for(var i = 0; i < input.length; i++){
                  var thisObj = input[i];
                  count += parseInt(thisObj.quantity || 0);
              }
              return count;

          }else{
              return '';
          }
      }
  };

  function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
  }


      Console.groupEnd();
  return filter;
});
