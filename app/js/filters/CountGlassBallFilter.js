define([
    // Standard Libs
    'Console'// lib/console/console
    , 'Angular'    // lib/angular/angular
    , 'Underscore' // lib/underscore/underscore
], function (Console,angular,_) {
  "use strict";
  Console.group("Entering CountGlassBallFilter module.");

  var filter = function () {
      return function(input) {
          Console.group("Entering CountGlassBallFilter module. input",input);
          if(input){
              var count = 0;

              _.each(input, function(thisObj, key) {
                  if(thisObj.list){
                      var countNum = 0;
                      _.each(thisObj.list, function(thisItem, keyItem) {
                          countNum = countNum + parseInt(thisItem.countNum || '0')
                      });
                      thisObj.countNum = countNum;
                  }
                  count = count + parseInt(thisObj.countNum || '0');
                  Console.debug("count",count);
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
