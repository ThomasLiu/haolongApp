define([
    // Standard Libs
    'Console'// lib/console/console
    , 'Angular'    // lib/angular/angular
    , 'Underscore' // lib/underscore/underscore
], function (Console,angular,_) {
  "use strict";
  Console.group("Entering CountAreaFilter module.");

  var filter = function () {
      return function(input) {
          Console.group("Entering CountAreaFilter module. input",input);
          if(input){
              var count = 0;

              _.each(input, function(thisObj, key) {
                  if(thisObj.needLength && thisObj.needWidth && thisObj.thisQuantity){
                      Console.debug("thisObj",thisObj);
                      Console.debug("parseInt(thisObj.needLength)",parseInt(thisObj.needLength));
                      Console.debug("parseInt(thisObj.needWidth)",parseInt(thisObj.needWidth));
                      Console.debug("parseInt(thisObj.thisQuantity || 0)",parseInt(thisObj.thisQuantity || 0));
                      count += (parseInt(thisObj.needLength) * parseInt(thisObj.needWidth) * parseInt(thisObj.thisQuantity || 0));
                      Console.debug("count",count);
                  }
              });
              return count;

          }else{
              return '';
          }
          Console.groupEnd();
      }
  };




      Console.groupEnd();
  return filter;
});
